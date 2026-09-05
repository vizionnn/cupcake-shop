import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { Product } from "@/types";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: rawId } = await context.params;
    const currentId = parseInt(rawId, 10);

    const recommended = db
      .prepare(
        "SELECT * FROM products WHERE id != ? ORDER BY RANDOM() LIMIT 4"
      )
      .all(isNaN(currentId) ? 0 : currentId) as Product[];

    return NextResponse.json(recommended);
  } catch (error) {
    console.error("Erro ao buscar recomendados:", error);
    return NextResponse.json(
      { error: "Erro ao buscar cupcakes recomendados." },
      { status: 500 }
    );
  }
}
