import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { Order, OrderItem } from "@/types";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: rawId } = await context.params;
    const orderId = parseInt(rawId, 10);
    if (isNaN(orderId)) {
      return NextResponse.json(
        { error: "ID de pedido inválido." },
        { status: 400 }
      );
    }

    const { data: orderData, error: orderErr } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (orderErr || !orderData) {
      return NextResponse.json(
        { error: "Pedido não encontrado." },
        { status: 404 }
      );
    }

    const order = orderData as Order;

    const { data: itemsData } = await supabase
      .from("order_items")
      .select("*, products(name, image_emoji)")
      .eq("order_id", orderId);

    const items: OrderItem[] = ((itemsData as any[]) || []).map((item) => ({
      id: item.id,
      order_id: item.order_id,
      product_id: item.product_id,
      product_name: item.products?.name || item.product_name,
      unit_price: Number(item.unit_price),
      quantity: item.quantity,
      image_emoji: item.products?.image_emoji,
    }));

    order.items = items;

    return NextResponse.json(order);
  } catch (error) {
    console.error("Erro ao buscar pedido:", error);
    return NextResponse.json(
      { error: "Erro ao buscar detalhes do pedido." },
      { status: 500 }
    );
  }
}
