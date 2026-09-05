import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getRecommendedProducts } from "@/lib/products-data";
import { Product } from "@/types";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: rawId } = await context.params;
    const currentId = parseInt(rawId, 10);

    let query = supabase.from("products").select("*").limit(4);

    if (!isNaN(currentId)) {
      query = query.neq("id", currentId);
    }

    const { data: recommended } = await query;

    if (recommended && recommended.length > 0) {
      return NextResponse.json(recommended);
    }

    return NextResponse.json(
      getRecommendedProducts(isNaN(currentId) ? 0 : currentId, 4)
    );

  } catch (error) {
    console.error("Erro ao buscar recomendados:", error);
    return NextResponse.json(
      { error: "Erro ao buscar cupcakes recomendados." },
      { status: 500 }
    );
  }
}
