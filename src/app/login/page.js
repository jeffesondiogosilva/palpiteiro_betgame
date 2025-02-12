"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    // Utiliza o signIn com o provider "credentials"
    const result = await signIn("credentials", {
      redirect: false, // Impede o redirecionamento automático para que possamos controlar via código
      email,
      password,
    });

    if (result.error) {
      setError(result.error || "Erro ao fazer login");
    } else {
      // Se o login for bem-sucedido, redireciona para /matches
      router.push("/matches");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-dark">
      <div className="bg-light text-dark p-5 rounded-lg shadow-lg w-100" style={{ maxWidth: "400px" }}>
        <h1 className="text-center text-2xl font-bold mb-4">Login</h1>
        {error && <p className="text-danger text-center mb-3">{error}</p>}

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Entrar
          </button>
        </form>
      </div>
    </div>

  );
}
