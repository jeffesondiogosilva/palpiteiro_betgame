// src/app/api/auth/register/route.js
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();
    console.log("Dados recebidos:", { name, email, password });

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "Usuário já existe" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Senha hashed:", hashedPassword);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      { message: "Usuário cadastrado com sucesso!", user },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error:", error.stack)  // Only console.log works here, anything else was throwing errors for me.

    return NextResponse.json(
      { error: "Erro ao processar a requisição" },
      { status: 500 }
    );
  }
}
