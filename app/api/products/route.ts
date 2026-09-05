import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { Product } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tag = searchParams.get("tag");

    let products: Product[];
    if (tag && tag !== "Todos") {
      products = db
        .prepare("SELECT * FROM products WHERE flavor_tag = ? ORDER BY id ASC")
        .all(tag) as Product[];
    } else {
      products = db
        .prepare("SELECT * FROM products ORDER BY id ASC")
        .all() as Product[];
    }

    return NextResponse.json(products);
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    return NextResponse.json(
      { error: "Erro ao buscar produtos no cardápio." },
      { status: 500 }
    );
  }
}
