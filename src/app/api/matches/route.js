// src/app/api/matches/route.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req) {
    try {
        const todayString = new Date().toISOString().split("T")[0]; // "2025-02-01"
        const startOfDay = new Date(todayString); // "2025-02-01T00:00:00.000Z"
        const endOfDay = new Date(todayString);
        endOfDay.setUTCHours(23, 59, 59, 999);

        const matches = await prisma.match.findMany({
            where: {
                date: {
                    gte: startOfDay,
                    lte: endOfDay,
                },
            },
            orderBy: { date: "asc" },
        });


        return new Response(JSON.stringify(matches), {
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        if (error == null) {
            console.error("Erro ao buscar jogos: Erro desconhecido (valor null recebido)");
        } else {
            console.error("Erro ao buscar jogos: " + error.toString());
        }
        return new Response("Erro interno", { status: 500 });
    }

}
