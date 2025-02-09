// src/app/api/shots/route.js
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// POST: Recebe os palpites e os salva na tabela "shot"
export async function POST(request) {
  try {
    // Recupera o token para identificar o usuário (user_id)
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Extrai os palpites do corpo da requisição
    const { shotes } = await request.json();
    // Exemplo de shotes: { "1": "home", "2": "draw", "3": "away" }

    // Mapeamento dos tipos de resultado para seus respectivos IDs
    const resultMapping = { home: 1, away: 2, draw: 3 };

    // Salva cada palpite na tabela "shot"
    const shotPromises = Object.entries(shotes).map(async ([matchId, result]) => {
      // Verifica se o resultado é válido
      const result_type_id = resultMapping[result];
      if (!result_type_id) return;

      return await prisma.shot.create({
        data: {
          user_id: token.id,                  // O ID do usuário a partir do token
          match_id: parseInt(matchId, 10),     // Converte o matchId para número
          result_type_id,                      // Mapeado (1, 2 ou 3)
        },
      });
    });

    await Promise.all(shotPromises);

    return NextResponse.json({ message: "Palpites enviados com sucesso!" }, { status: 200 });
  } catch (error) {
    console.error("Erro ao salvar palpites:", error);
    return NextResponse.json({ error: "Erro ao salvar palpites" }, { status: 500 });
  }
}
