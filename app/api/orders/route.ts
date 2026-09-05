import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { CheckoutPayload, Product } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body: CheckoutPayload = await request.json();
    const {
      customer_name,
      customer_email,
      delivery_address,
      customer_cep,
      estimated_delivery,
      payment_method,
      coupon_code,
      items,
    } = body;

    // 1. Validações básicas de preenchimento
    if (
      !customer_name?.trim() ||
      !customer_email?.trim() ||
      !delivery_address?.trim() ||
      !payment_method?.trim() ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return NextResponse.json(
        { error: "Por favor, preencha todos os campos obrigatórios." },
        { status: 400 }
      );
    }

    // 2. Recálculo seguro no servidor (prevenção contra manipulação de preço no front)
    let calculatedSubtotal = 0;
    const validatedItems: {
      product_id: number;
      product_name: string;
      quantity: number;
      unit_price: number;
      image_emoji: string;
    }[] = [];

    for (const item of items) {
      const product = db
        .prepare("SELECT * FROM products WHERE id = ?")
        .get(item.product_id) as Product | undefined;

      if (!product) {
        return NextResponse.json(
          { error: `Produto com ID ${item.product_id} não encontrado.` },
          { status: 400 }
        );
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          {
            error: `Estoque insuficiente para "${product.name}". Restam apenas ${product.stock} unidades.`,
          },
          { status: 400 }
        );
      }

      const itemTotal = product.price * item.quantity;
      calculatedSubtotal += itemTotal;

      validatedItems.push({
        product_id: product.id,
        product_name: product.name,
        quantity: item.quantity,
        unit_price: product.price,
        image_emoji: product.image_emoji,
      });
    }

    // 3. Cálculo de frete e desconto
    const shipping_fee = calculatedSubtotal >= 49.9 ? 0 : 9.9;
    const discount =
      coupon_code?.trim().toUpperCase() === "NUVEM10"
        ? Number((calculatedSubtotal * 0.1).toFixed(2))
        : 0;

    const total = Number(
      (calculatedSubtotal - discount + shipping_fee).toFixed(2)
    );

    // 4. Transação atômica no SQLite
    const insertOrderTx = db.transaction(() => {
      const orderStmt = db.prepare(`
        INSERT INTO orders (
          customer_name, customer_email, delivery_address,
          customer_cep, estimated_delivery, payment_method,
          subtotal, discount, shipping_fee, coupon_code, total
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const result = orderStmt.run(
        customer_name.trim(),
        customer_email.trim(),
        delivery_address.trim(),
        customer_cep?.trim() || null,
        estimated_delivery?.trim() || null,
        payment_method.trim(),
        calculatedSubtotal,
        discount,
        shipping_fee,
        coupon_code?.trim().toUpperCase() || null,
        total
      );

      const orderId = result.lastInsertRowid;

      const itemStmt = db.prepare(`
        INSERT INTO order_items (order_id, product_id, product_name, unit_price, quantity)
        VALUES (?, ?, ?, ?, ?)
      `);

      const updateStockStmt = db.prepare(`
        UPDATE products SET stock = stock - ? WHERE id = ?
      `);

      for (const item of validatedItems) {
        itemStmt.run(orderId, item.product_id, item.product_name, item.unit_price, item.quantity);
        updateStockStmt.run(item.quantity, item.product_id);
      }

      return orderId;
    });

    const orderId = insertOrderTx();

    return NextResponse.json({
      success: true,
      order_id: orderId,
      total,
      message: "Pedido registrado com sucesso!",
    });
  } catch (error) {
    console.error("Erro ao registrar pedido:", error);
    return NextResponse.json(
      { error: "Erro interno ao processar pedido." },
      { status: 500 }
    );
  }
}
