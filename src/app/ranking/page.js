"use client";
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

async function getRanking() {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/ranking`;
    const res = await fetch(apiUrl, { cache: "no-store" });

    if (!res.ok) {
      throw new Error(`Erro na requisição: ${res.status} - ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Erro ao buscar o ranking:", error);
    return []; // Retorna um array vazio para evitar que a UI quebre
  }
}

export default function RankingPage() {
  const [ranking, setRanking] = useState([]);

  useEffect(() => {
    async function fetchRanking() {
      const data = await getRanking();
      setRanking(data);
    }

    fetchRanking();
  }, []);

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">🏆 Ranking dos Palpiteiros</h1>

      <div className="table-responsive">
        <table className="table table-striped table-hover shadow-sm">
          <thead className="table-dark">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Nome</th>
              <th scope="col">Pontuação</th>
            </tr>
          </thead>
          <tbody>
            {ranking.length > 0 ? (
              ranking.map((user, index) => (
                <tr key={user.id}>
                  <td className="fw-bold">{index + 1}</td>
                  <td>{user.name}</td>
                  <td className="fw-bold">{user.score}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center text-muted">
                  Nenhum jogador no ranking ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
