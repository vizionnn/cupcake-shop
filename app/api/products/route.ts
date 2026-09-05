import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
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

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    return NextResponse.json(
      { error: "Erro ao buscar produtos no cardápio." },
      { status: 500 }
    );
  }
}
