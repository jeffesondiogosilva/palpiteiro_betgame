// src/app/matches/page.js
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function MatchesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redireciona para /login se não estiver autenticado
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const [matches, setMatches] = useState([]);
  const [error, setError] = useState(null);
  const [shotes, setShotes] = useState({});

  // Busca os jogos somente quando o status for "authenticated"
  useEffect(() => {
    if (status === "authenticated") {
      async function fetchMatches() {
        try {
          const res = await fetch("/api/matches");
          if (!res.ok) throw new Error("Falha ao buscar jogos");
          const data = await res.json();
          setMatches(data);
        } catch (err) {
          setError(err.message);
        }
      }
      fetchMatches();
    }
  }, [status]);

  const handleChange = (matcheId, value) => {
    setShotes((prev) => ({
      ...prev,
      [matcheId]: value,
    }));
  };

  // Exemplo simplificado da página matches (trecho do handleSubmit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Palpites enviados:", shotes);
    try {
      const res = await fetch("/api/shots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shotes }), // Ex: { "1": "home", "2": "draw", ... }
      });
      if (!res.ok) throw new Error("Falha ao enviar palpites");
      alert("Palpites enviados com sucesso!");
    } catch (error) {
      console.error("Erro ao enviar palpites:", error);
      alert("Erro ao enviar palpites");
    }
  };


  if (status === "loading") {
    return <p>Carregando...</p>;
  }

  // Enquanto o redirecionamento não acontecer (status pode estar indefinido momentaneamente), evita renderizar o conteúdo
  if (status !== "authenticated") {
    return null;
  }

  return (
    <div className="container mt-5 bg-dark text-white p-4 rounded">
      <h1 className="mb-4 text-center">Palpite nos Jogos</h1>
      {error && <p className="text-danger">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="list-group">
          {Array.isArray(matches) &&
            matches.map((match) => (
              <div className="list-group-item mb-3 d-flex" key={match.id}>
                <div className="d-flex justify-content-between w-100">
                  <h5 className="mb-2">
                    {match.home.charAt(0).toUpperCase() + match.home.slice(1)} x{" "}
                    {match.away.charAt(0).toUpperCase() + match.away.slice(1)}
                  </h5>
                </div>

                <div className="form-check pl-2 ml-2" style={{ marginLeft: "10px" }}>
                  <input
                    type="radio"
                    id={`home-${match.id}`}
                    name={`match-${match.id}`}
                    value="home"
                    checked={shotes[match.id] === "home"}
                    onChange={() => handleChange(match.id, "home")}
                    className="form-check-input"
                  />
                  <label htmlFor={`home-${match.id}`} className="form-check-label">
                    Casa
                  </label>
                </div>

                <div className="form-check pl-2 ml-2" style={{ marginLeft: "10px" }}>
                  <input
                    type="radio"
                    id={`draw-${match.id}`}
                    name={`match-${match.id}`}
                    value="draw"
                    checked={shotes[match.id] === "draw"}
                    onChange={() => handleChange(match.id, "draw")}
                    className="form-check-input"
                  />
                  <label htmlFor={`draw-${match.id}`} className="form-check-label">
                    Empate
                  </label>
                </div>

                <div className="form-check pl-2 ml-2" style={{ marginLeft: "10px" }}>
                  <input
                    type="radio"
                    id={`away-${match.id}`}
                    name={`match-${match.id}`}
                    value="away"
                    checked={shotes[match.id] === "away"}
                    onChange={() => handleChange(match.id, "away")}
                    className="form-check-input"
                  />
                  <label htmlFor={`away-${match.id}`} className="form-check-label">
                    Fora
                  </label>
                </div>
              </div>
            ))}
        </div>

        <div className="d-flex justify-content-center mt-4">
          <button type="submit" className="btn btn-primary btn-lg">
            Enviar Palpite
          </button>
        </div>
      </form>
    </div>
  );
}
