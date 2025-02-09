import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    console.log('🔍 Iniciando busca do ranking...');

    // Buscar os usuários e seus palpites (shots) e partidas (matches)
    const users = await prisma.user.findMany({
      include: {
        shots: {
          select: {
            result_type_id: true,
            match: {
              select: {
                result_type_id: true,
              },
            },
          },
        },
      },
    });

    if (!users || users.length === 0) {
      console.warn('⚠️ Nenhum usuário encontrado!');
      return NextResponse.json({ error: 'Nenhum usuário encontrado' }, { status: 404 });
    }

    console.log(`👥 Usuários encontrados: ${users.length}`);

    // Criar ranking dos usuários
    const ranking = users.map(user => {
      let score = 0;

      user.shots.forEach(shot => {
        if (shot.match && shot.match.result_type_id === shot.result_type_id) {
          score += 1; // Acerta o palpite
        }
      });

      return { id: user.id, name: user.name, score };
    });

    // Ordenar ranking por pontuação
    ranking.sort((a, b) => b.score - a.score);

    console.log('✅ Ranking gerado com sucesso!');
    return NextResponse.json(ranking);
  } catch (error) {
    console.error('❌ Erro na API de ranking:', error);
    return NextResponse.json({ error: 'Erro ao buscar ranking', details: error.message }, { status:500 });
  }
}
