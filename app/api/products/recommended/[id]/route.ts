import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
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

    const { data: recommended, error } = await query;

    if (error) throw error;

    return NextResponse.json(recommended || []);
  } catch (error) {
    console.error("Erro ao buscar recomendados:", error);
    return NextResponse.json(
      { error: "Erro ao buscar cupcakes recomendados." },
      { status: 500 }
    );
  }
}
