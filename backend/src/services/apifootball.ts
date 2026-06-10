import { config } from "../config";

// Integração com a API-Football (api-sports.io).
// O backend é o único que fala com essa API — a chave nunca vai pro frontend.

const { baseUrl, key, league, season } = config.apiFootball;

// --- Tipos parciais da resposta da API-Football (só o que usamos) ---

interface ApiFixtureResponse {
  fixture: {
    id: number;
    date: string;
    venue: { name: string | null; city: string | null };
    status: { short: string };
  };
  league: { round: string };
  teams: {
    home: { name: string; logo: string };
    away: { name: string; logo: string };
  };
  goals: { home: number | null; away: number | null };
}

interface ApiEventResponse {
  time: { elapsed: number; extra: number | null };
  team: { name: string };
  player: { id: number | null; name: string | null };
  type: string;
  detail: string;
}

interface ApiLineupResponse {
  team: { name: string };
  startXI: { player: ApiLineupPlayer }[];
  substitutes: { player: ApiLineupPlayer }[];
}

interface ApiLineupPlayer {
  id: number;
  name: string;
  pos: string | null;
}

interface ApiEnvelope<T> {
  response: T;
  errors: unknown;
  results: number;
}

async function apiGet<T>(path: string): Promise<T> {
  if (!key) {
    throw new Error(
      "API_FOOTBALL_KEY não configurada — defina no backend/.env antes de buscar dados.",
    );
  }
  const res = await fetch(`${baseUrl}${path}`, {
    headers: { "x-apisports-key": key },
  });
  if (!res.ok) {
    throw new Error(`API-Football respondeu ${res.status} em ${path}`);
  }
  const json = (await res.json()) as ApiEnvelope<T>;
  return json.response;
}

// --- Mapeamentos: resposta da API -> shape dos nossos modelos Prisma ---

export interface MappedMatch {
  id: string;
  date: Date;
  homeTeam: string;
  awayTeam: string;
  homeFlag: string | null;
  awayFlag: string | null;
  homeScore: number | null;
  awayScore: number | null;
  status: string;
  stage: string;
  group: string | null;
  venue: string | null;
}

function mapFixture(f: ApiFixtureResponse): MappedMatch {
  // O "round" da Copa vem como "Group Stage - 1", "Round of 16", "Final", etc.
  const round = f.league.round ?? "";
  const isGroup = /group/i.test(round);
  return {
    id: String(f.fixture.id),
    date: new Date(f.fixture.date),
    homeTeam: f.teams.home.name,
    awayTeam: f.teams.away.name,
    homeFlag: f.teams.home.logo ?? null,
    awayFlag: f.teams.away.logo ?? null,
    homeScore: f.goals.home,
    awayScore: f.goals.away,
    status: f.fixture.status.short,
    stage: isGroup ? "Group Stage" : round,
    group: isGroup ? round.replace(/^Group Stage\s*-?\s*/i, "").trim() || null : null,
    venue: f.fixture.venue?.name ?? null,
  };
}

export interface MappedEvent {
  type: string;
  detail: string | null;
  minute: number;
  playerId: number | null;
  playerName: string | null;
  teamName: string;
}

function mapEvent(e: ApiEventResponse): MappedEvent {
  return {
    type: e.type,
    detail: e.detail ?? null,
    minute: e.time.elapsed + (e.time.extra ?? 0),
    playerId: e.player?.id ?? null,
    playerName: e.player?.name ?? null,
    teamName: e.team.name,
  };
}

export interface MappedLineupPlayer {
  playerId: number;
  playerName: string;
  teamName: string;
  position: string | null;
  isStarter: boolean;
}

function mapLineups(lineups: ApiLineupResponse[]): MappedLineupPlayer[] {
  const players: MappedLineupPlayer[] = [];
  for (const lineup of lineups) {
    for (const { player } of lineup.startXI ?? []) {
      players.push({
        playerId: player.id,
        playerName: player.name,
        teamName: lineup.team.name,
        position: player.pos,
        isStarter: true,
      });
    }
    for (const { player } of lineup.substitutes ?? []) {
      players.push({
        playerId: player.id,
        playerName: player.name,
        teamName: lineup.team.name,
        position: player.pos,
        isStarter: false,
      });
    }
  }
  return players;
}

// --- API pública do serviço ---

/** Busca todos os fixtures da Copa (league/season configurados). */
export async function fetchFixtures(): Promise<MappedMatch[]> {
  const response = await apiGet<ApiFixtureResponse[]>(
    `/fixtures?league=${league}&season=${season}`,
  );
  return response.map(mapFixture);
}

/** Busca eventos (gols, cartões, subs) de um jogo. */
export async function fetchEvents(fixtureId: string): Promise<MappedEvent[]> {
  const response = await apiGet<ApiEventResponse[]>(
    `/fixtures/events?fixture=${fixtureId}`,
  );
  return response.map(mapEvent);
}

/** Busca as escalações dos dois times de um jogo. */
export async function fetchLineups(
  fixtureId: string,
): Promise<MappedLineupPlayer[]> {
  const response = await apiGet<ApiLineupResponse[]>(
    `/fixtures/lineups?fixture=${fixtureId}`,
  );
  return mapLineups(response);
}
