import dotenv from "dotenv";

dotenv.config();

function required(key: string): string {
  const value = process.env[key];
  if (!value) {
    // Em dev avisamos sem derrubar o servidor; em prod isso deveria falhar cedo.
    console.warn(`[config] variável de ambiente ausente: ${key}`);
  }
  return value ?? "";
}

export const config = {
  port: Number(process.env.PORT ?? 3001),
  nodeEnv: process.env.NODE_ENV ?? "development",
  frontendUrl: process.env.FRONTEND_URL ?? "http://localhost:5173",
  sessionSecret: process.env.SESSION_SECRET ?? "dev-secret",
  databaseUrl: required("DATABASE_URL"),
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID ?? "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    callbackUrl:
      process.env.GOOGLE_CALLBACK_URL ??
      "http://localhost:3001/auth/google/callback",
  },
  // Fonte gratuita dos fixtures da Copa 2026 (calendário).
  thesportsdb: {
    key: process.env.THESPORTSDB_KEY ?? "3", // "3" = chave pública de teste
    leagueId: process.env.THESPORTSDB_LEAGUE ?? "4429", // FIFA World Cup
    season: process.env.THESPORTSDB_SEASON ?? "2026",
    baseUrl: "https://www.thesportsdb.com/api/v1/json",
  },
  // Caminho pago/legado — usado só se um dia houver plano que libere a season.
  apiFootball: {
    key: process.env.API_FOOTBALL_KEY ?? "",
    league: process.env.API_FOOTBALL_LEAGUE ?? "1",
    season: process.env.API_FOOTBALL_SEASON ?? "2026",
    baseUrl: "https://v3.football.api-sports.io",
  },
};
