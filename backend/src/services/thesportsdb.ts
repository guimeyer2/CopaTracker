import { config } from "../config";
import type { MappedMatch } from "./apifootball";

// Integração com a TheSportsDB — fonte gratuita do calendário da Copa 2026.
// O plano free capa o endpoint por temporada em 15 jogos, mas `eventsround`
// não tem esse limite: buscamos rodada a rodada e juntamos tudo.

const { baseUrl, key, leagueId, season } = config.thesportsdb;

// Fase de grupos = rounds 1-3 (24 jogos cada). O mata-mata da Copa 2026 ainda
// não está publicado (confrontos TBD até os grupos acabarem); incluímos os
// códigos prováveis pra que um re-seed futuro já os capture quando existirem.
const ROUNDS = [1, 2, 3, 125, 150, 160, 170, 180, 200];

interface TsdbEvent {
  idEvent: string;
  strHomeTeam: string;
  strAwayTeam: string;
  strHomeTeamBadge: string | null;
  strAwayTeamBadge: string | null;
  strTimestamp: string | null;
  dateEvent: string | null;
  strTime: string | null;
  strVenue: string | null;
  intRound: string | null;
  strStatus: string | null;
  strGroup: string | null;
  intHomeScore: string | null;
  intAwayScore: string | null;
}

async function fetchRound(round: number): Promise<TsdbEvent[]> {
  const url = `${baseUrl}/${key}/eventsround.php?id=${leagueId}&r=${round}&s=${season}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`TheSportsDB respondeu ${res.status} na rodada ${round}`);
  }
  const json = (await res.json()) as { events: TsdbEvent[] | null };
  return json.events ?? [];
}

function stageFromRound(round: string | null): string {
  if (round && ["1", "2", "3"].includes(round)) return "Group Stage";
  const names: Record<string, string> = {
    "125": "Round of 32",
    "150": "Round of 16",
    "160": "Quarter-finals",
    "170": "Semi-finals",
    "180": "Third-place",
    "200": "Final",
  };
  return (round && names[round]) ?? "Knockout";
}

function mapStatus(s: string | null): string {
  if (!s) return "NS";
  const u = s.toUpperCase();
  if (["FT", "AET", "PEN"].includes(u)) return u;
  if (u.includes("FINISHED")) return "FT";
  return s;
}

function parseDate(e: TsdbEvent): Date {
  // strTimestamp vem em UTC sem sufixo ("2026-06-11T19:00:00") — força UTC.
  if (e.strTimestamp) {
    const iso = /[zZ]|[+-]\d{2}:?\d{2}$/.test(e.strTimestamp)
      ? e.strTimestamp
      : `${e.strTimestamp}Z`;
    return new Date(iso);
  }
  return new Date(`${e.dateEvent ?? ""}T${e.strTime ?? "00:00:00"}Z`);
}

function toNumber(v: string | null): number | null {
  return v === null || v === "" ? null : Number(v);
}

function mapEvent(e: TsdbEvent): MappedMatch {
  const isGroup = !!e.intRound && ["1", "2", "3"].includes(e.intRound);
  return {
    id: String(e.idEvent),
    date: parseDate(e),
    homeTeam: e.strHomeTeam,
    awayTeam: e.strAwayTeam,
    homeFlag: e.strHomeTeamBadge ?? null,
    awayFlag: e.strAwayTeamBadge ?? null,
    homeScore: toNumber(e.intHomeScore),
    awayScore: toNumber(e.intAwayScore),
    status: mapStatus(e.strStatus),
    stage: stageFromRound(e.intRound),
    group: isGroup && e.strGroup ? `Group ${e.strGroup}` : null,
    venue: e.strVenue ?? null,
  };
}

/** Busca todos os jogos publicados da Copa 2026 (grupos + knockout disponível). */
export async function fetchWorldCupFixtures(): Promise<MappedMatch[]> {
  const all: MappedMatch[] = [];
  const seen = new Set<string>();

  for (const r of ROUNDS) {
    let events: TsdbEvent[] = [];
    try {
      events = await fetchRound(r);
    } catch (err) {
      console.warn(`[thesportsdb] rodada ${r} falhou:`, err);
      continue;
    }
    for (const ev of events) {
      if (seen.has(ev.idEvent)) continue;
      seen.add(ev.idEvent);
      all.push(mapEvent(ev));
    }
  }

  return all;
}
