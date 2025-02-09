import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
  try {
    // Extrai email e senha do corpo da requisição
    const { email, password } = await req.json();

    // Procura pelo usuário na tabela 'user' com base no email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Se não encontrar, retorna uma mensagem de erro
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    // Compara a senha informada com a senha armazenada (hash)
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json({ error: "Senha incorreta" }, { status: 401 });
    }

    // Se tudo estiver certo, gera um token (opcional)
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });

    // Retorna o token e uma indicação de redirecionamento para /matches
    return NextResponse.json({ token, redirectTo: "/matches" }, { status: 200 });
  } catch (error) {
    console.error("Erro interno do servidor:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
