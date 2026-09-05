import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { INITIAL_PRODUCTS } from "@/lib/products-data";
import { Product } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tag = searchParams.get("tag");

    let query = supabase
      .from("products")
      .select("*")
      .order("id", { ascending: true });

    if (tag && tag !== "Todos") {
      query = query.eq("flavor_tag", tag);
    }

    const { data } = await query;

    if (data && data.length > 0) {
      return NextResponse.json(data);
    }

    // Fallback gracioso com os 8 cupcakes artesanais
    let fallback = INITIAL_PRODUCTS;
    if (tag && tag !== "Todos") {
      fallback = fallback.filter((p) => p.flavor_tag === tag);
    }

    return NextResponse.json(fallback);

  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    return NextResponse.json(
      { error: "Erro ao buscar produtos no cardápio." },
      { status: 500 }
    );
  }
}
