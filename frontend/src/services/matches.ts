import { apiGet } from "./api";
import { mockMatches } from "../data/mockMatches";
import type { Match, MatchDetail } from "../types";

// Enquanto o backend não tem dados (sem banco/seed), caímos no mock pra
// desenvolver a UI. Assim que GET /matches retorna jogos, usamos os reais.
export async function getMatches(): Promise<Match[]> {
  try {
    const matches = await apiGet<Match[]>("/matches");
    return matches.length > 0 ? matches : mockMatches;
  } catch {
    console.warn("[matches] backend indisponível — usando dados de demonstração.");
    return mockMatches;
  }
}

export async function getMatch(id: string): Promise<MatchDetail | null> {
  try {
    return await apiGet<MatchDetail>(`/matches/${id}`);
  } catch {
    const mock = mockMatches.find((m) => m.id === id);
    return mock ? { ...mock, events: [], lineups: [] } : null;
  }
}
