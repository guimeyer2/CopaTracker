// Tipos compartilhados — espelham os modelos do backend (Prisma).

export interface Match {
  id: string;
  date: string; // ISO 8601 (UTC) vindo do backend
  homeTeam: string;
  awayTeam: string;
  homeFlag: string | null;
  awayFlag: string | null;
  homeScore: number | null;
  awayScore: number | null;
  status: string; // "NS", "1H", "HT", "2H", "FT", "LIVE", etc.
  stage: string;
  group: string | null;
  venue: string | null;
}

export interface MatchEvent {
  id: string;
  type: string;
  detail: string | null;
  minute: number;
  playerId: number | null;
  playerName: string | null;
  teamName: string;
}

export interface MatchLineup {
  id: string;
  playerId: number;
  playerName: string;
  teamName: string;
  position: string | null;
  isStarter: boolean;
}

export interface MatchDetail extends Match {
  events: MatchEvent[];
  lineups: MatchLineup[];
}

export interface Watch {
  id: string;
  matchId: string;
  rating: number | null;
  watchedAt: string;
}

const LIVE_STATUSES = ["1H", "HT", "2H", "ET", "BT", "P", "LIVE"];
const FINISHED_STATUSES = ["FT", "AET", "PEN"];

export function isLive(match: Pick<Match, "status">): boolean {
  return LIVE_STATUSES.includes(match.status);
}

export function isFinished(match: Pick<Match, "status">): boolean {
  return FINISHED_STATUSES.includes(match.status);
}

export function hasScore(match: Match): boolean {
  return match.homeScore !== null && match.awayScore !== null;
}
