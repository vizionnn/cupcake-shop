import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
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

    // 2. Busca os produtos no Supabase para recálculo seguro no servidor
    const productIds = items.map((i) => i.product_id);
    const { data: dbProducts, error: prodErr } = await supabase
      .from("products")
      .select("*")
      .in("id", productIds);

    if (prodErr || !dbProducts) {
      console.error("Erro ao buscar produtos para checkout:", prodErr);
      return NextResponse.json(
        { error: "Erro ao consultar produtos no banco de dados." },
        { status: 500 }
      );
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

    // 4. Inserção do pedido na tabela orders do Supabase
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

    if (orderErr || !orderData) {
      console.error("Erro ao registrar pedido no Supabase:", orderErr);
      return NextResponse.json(
        { error: "Não foi possível registrar o pedido no banco de dados." },
        { status: 500 }
      );
    }

    const orderId = orderData.id;

    // 5. Inserção dos itens na tabela order_items
    const orderItemsPayload = validatedItems.map((item) => ({
      order_id: orderId,
      product_id: item.product_id,
      product_name: item.product_name,
      unit_price: item.unit_price,
      quantity: item.quantity,
    }));

    const { error: itemsErr } = await supabase
      .from("order_items")
      .insert(orderItemsPayload);

    if (itemsErr) {
      console.error("Erro ao registrar itens do pedido:", itemsErr);
    }

    // 6. Atualização de estoque dos produtos
    for (const item of validatedItems) {
      const { error: rpcErr } = await supabase.rpc("decrement_stock", {
        p_product_id: item.product_id,
        p_quantity: item.quantity,
      });

      if (rpcErr) {
        // Fallback caso a função RPC ainda não esteja instalada no Supabase
        const current = dbProducts.find((p) => p.id === item.product_id);
        if (current) {
          await supabase
            .from("products")
            .update({ stock: Math.max(0, current.stock - item.quantity) })
            .eq("id", item.product_id);
        }
      }
    }

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

