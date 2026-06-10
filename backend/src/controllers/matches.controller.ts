import type { Request, Response } from "express";
import { prisma } from "../services/prisma";
import {
  ensureFixturesCached,
  ensureMatchDetailCached,
} from "../services/cache";

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

  const exists = await prisma.match.findUnique({ where: { id } });
  if (!exists) {
    res.status(404).json({ error: "Jogo não encontrado" });
    return;
  }

  try {
    await ensureMatchDetailCached(id);
  } catch (err) {
    console.error(`[matches] falha ao cachear detalhe do jogo ${id}:`, err);
  }

  const match = await prisma.match.findUnique({
    where: { id },
    include: {
      events: { orderBy: { minute: "asc" } },
      lineups: true,
    },
  });
  res.json(match);
}
