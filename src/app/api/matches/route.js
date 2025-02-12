// src/app/api/matches/route.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req) {
    try {

        const todayString = new Date().toISOString().split("T")[0]; // "2025-02-11"
        const startOfDay = new Date(todayString); // "2025-02-11T00:00:00.000Z"
        const endOfDay = new Date(todayString);
        endOfDay.setUTCHours(23, 59, 59, 999);
        
        const matches = await prisma.match.findMany({
            where: {
                date: {
                    gte: startOfDay, // Maior ou igual a meia-noite de hoje
                    lte: endOfDay    // Menor ou igual a 23:59:59 de hoje
                }
            }
        });
        
        console.log(matches);
        
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
