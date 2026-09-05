import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { CheckoutPayload, Product } from "@/types";
import { INITIAL_PRODUCTS } from "@/lib/products-data";
import { saveMemoryOrder } from "@/lib/orders-store";

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

    // 2. Busca os produtos no Supabase (com fallback resiliente para INITIAL_PRODUCTS)
    const productIds = items.map((i) => i.product_id);
    let dbProducts: Product[] = [];

    try {
      const { data: remoteProds, error: prodErr } = await supabase
        .from("products")
        .select("*")
        .in("id", productIds);

      if (!prodErr && remoteProds && remoteProds.length > 0) {
        dbProducts = remoteProds as Product[];
      }
    } catch (_) {}

    for (const pid of productIds) {
      if (!dbProducts.some((p) => p.id === pid)) {
        const fallback = INITIAL_PRODUCTS.find((p) => p.id === pid);
        if (fallback) dbProducts.push(fallback);
      }
    }


    let calculatedSubtotal = 0;
    const validatedItems: {
      product_id: number;
      product_name: string;
      quantity: number;
      unit_price: number;
      image_emoji: string;
    }[] = [];

    for (const item of items) {
      const product = dbProducts.find((p) => p.id === item.product_id) as Product | undefined;

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

      const itemTotal = Number(product.price) * item.quantity;
      calculatedSubtotal += itemTotal;

      validatedItems.push({
        product_id: product.id,
        product_name: product.name,
        quantity: item.quantity,
        unit_price: Number(product.price),
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

    // 4. Inserção do pedido no Supabase (com fallback resiliente para modo apresentação)
    let orderId: number | null = null;

    try {
      const { data: orderData, error: orderErr } = await supabase
        .from("orders")
        .insert({
          customer_name: customer_name.trim(),
          customer_email: customer_email.trim(),
          delivery_address: delivery_address.trim(),
          customer_cep: customer_cep?.trim() || null,
          estimated_delivery: estimated_delivery?.trim() || null,
          payment_method: payment_method.trim(),
          subtotal: calculatedSubtotal,
          discount,
          shipping_fee,
          coupon_code: coupon_code?.trim().toUpperCase() || null,
          total,
          status: "confirmado",
        })
        .select("id")
        .single();

      if (!orderErr && orderData) {
        orderId = Number(orderData.id);
      }
    } catch (_) {}

    // Fallback: se o banco ainda não tiver as tabelas criadas, gera ID de apresentação
    if (!orderId) {
      orderId = Math.floor(100000 + Math.random() * 900000);
    }

    // 5. Salva itens no Supabase se o pedido foi criado no banco
    try {
      const orderItemsPayload = validatedItems.map((item) => ({
        order_id: orderId,
        product_id: item.product_id,
        product_name: item.product_name,
        unit_price: item.unit_price,
        quantity: item.quantity,
      }));

      await supabase.from("order_items").insert(orderItemsPayload);

      for (const item of validatedItems) {
        await supabase.rpc("decrement_stock", {
          p_product_id: item.product_id,
          p_quantity: item.quantity,
        });
      }
    } catch (_) {}

    // 6. Registra o pedido no armazenamento em memória garantido
    saveMemoryOrder({
      id: orderId,
      customer_name: customer_name.trim(),
      customer_email: customer_email.trim(),
      delivery_address: delivery_address.trim(),
      customer_cep: customer_cep?.trim() || null,
      estimated_delivery: estimated_delivery?.trim() || null,
      payment_method: payment_method.trim(),
      subtotal: calculatedSubtotal,
      discount,
      shipping_fee,
      coupon_code: coupon_code?.trim().toUpperCase() || null,
      total,
      created_at: new Date().toISOString(),
      items: validatedItems.map((v, idx) => ({
        id: idx + 1,
        order_id: orderId!,
        product_id: v.product_id,
        product_name: v.product_name,
        quantity: v.quantity,
        unit_price: v.unit_price,
        image_emoji: v.image_emoji,
      })),
    });


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

