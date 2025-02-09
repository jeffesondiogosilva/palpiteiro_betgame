// src/app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "exemplo@email.com",
        },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) {
          throw new Error("Credenciais não fornecidas");
        }

        // Procura o usuário pelo email
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error("Email ou senha inválidos");
        }

        // Compara a senha informada com a senha armazenada (hash)
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error("Email ou senha inválidos");
        }

        // Retorne os dados do usuário que serão armazenados no token
        return { id: user.id, name: user.name, email: user.email };
      },
    }),
  ],
  adapter: PrismaAdapter(prisma), // Se você precisa salvar a sessão no banco, mas não é obrigatório
  secret: process.env.NEXTAUTH_SECRET, // Certifique-se de que essa variável esteja definida
  session: {
    strategy: "jwt", // Utiliza JWT para persistência da sessão
    maxAge: 30 * 24 * 60 * 60, // 30 dias (opcional)
  },
  pages: {
    signIn: "/login", // Redireciona para a página de login
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
