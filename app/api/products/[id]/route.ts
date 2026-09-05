import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getProductById } from "@/lib/products-data";
import { Product } from "@/types";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: rawId } = await context.params;
    const id = parseInt(rawId, 10);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "ID de produto inválido." },
        { status: 400 }
      );
    }

    const { data: dbProduct } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    const product = dbProduct || getProductById(id);

    if (!product) {
      return NextResponse.json(
        { error: "Produto não encontrado." },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Erro ao buscar detalhes do produto:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor." },
      { status: 500 }
    );
  }
}
