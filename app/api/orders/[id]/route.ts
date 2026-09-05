import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
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

    const order = db
      .prepare("SELECT * FROM orders WHERE id = ?")
      .get(orderId) as Order | undefined;

    if (!order) {
      return NextResponse.json(
        { error: "Pedido não encontrado." },
        { status: 404 }
      );
    }

    const items = db
      .prepare(`
        SELECT oi.*, p.name as product_name, p.image_emoji
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ?
      `)
      .all(orderId) as OrderItem[];

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
