import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const code = (body.code || "").trim().toUpperCase();

    if (!code) {
      return NextResponse.json(
        { valid: false, error: "Informe o código do cupom." },
        { status: 400 }
      );
    }

    if (code === "NUVEM10") {
      return NextResponse.json({
        valid: true,
        code: "NUVEM10",
        discount_percent: 10,
        description: "10% de desconto na primeira caixinha",
      });
    }

    return NextResponse.json(
      { valid: false, error: "Cupom inválido ou expirado." },
      { status: 400 }
    );
  } catch (error) {
    console.error("Erro ao validar cupom:", error);
    return NextResponse.json(
      { valid: false, error: "Erro ao processar cupom." },
      { status: 500 }
    );
  }
}
