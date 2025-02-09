// src/app/register/page.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      console.log(res);
      

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Texto de erro da API:", errorText);

        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (err) {
          throw new Error(errorText);
        }
        throw new Error(errorData.error || "Erro desconhecido");
      }

      const result = await res.json();
      console.log("Usuário registrado com sucesso:", result);
      router.push("/login");
    } catch (error) {
      console.error("Erro ao registrar usuário:", error.message);
      setError(error.message);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4 text-center">Registrar</h1>
      {error && <p className="text-danger">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Nome</label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Senha</label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Registrar</button>
      </form>
    </div>
  );
}
