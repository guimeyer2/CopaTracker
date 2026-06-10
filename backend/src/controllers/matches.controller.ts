import type { Request, Response } from "express";
import { prisma } from "../services/prisma";
import { ensureFixturesCached } from "../services/cache";

// GET /matches — lista todos os jogos, ordenados por data.
export async function listMatches(_req: Request, res: Response) {
  try {
    await ensureFixturesCached();
  } catch (err) {
    // Se a API externa falhar, ainda servimos o que tiver no banco.
    console.error("[matches] falha ao atualizar cache de fixtures:", err);
  }

  const matches = await prisma.match.findMany({
    orderBy: { date: "asc" },
  });
  res.json(matches);
}

// GET /matches/:id — detalhe de um jogo, com eventos e escalações.
export async function getMatch(req: Request, res: Response) {
  const { id } = req.params;

  // Detalhe (gols/assistências) é preenchido à mão e mora no banco.
  const match = await prisma.match.findUnique({
    where: { id },
    include: {
      events: { orderBy: { minute: "asc" } },
      lineups: true,
    },
  });

  if (!match) {
    res.status(404).json({ error: "Jogo não encontrado" });
    return;
  }

  res.json(match);
}
