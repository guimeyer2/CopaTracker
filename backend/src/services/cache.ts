import { prisma } from "./prisma";
import {
  fetchFixtures,
  fetchEvents,
  fetchLineups,
} from "./apifootball";

// Lógica de cache: o banco é a fonte de verdade pro frontend.
// A API-Football só é chamada quando os dados estão ausentes ou velhos.

const ONE_HOUR = 60 * 60 * 1000;
const ONE_DAY = 24 * ONE_HOUR;

/**
 * Garante que a lista de jogos esteja no banco.
 * Re-busca da API se o banco estiver vazio ou se o fixture mais recente
 * foi atualizado há mais de 1 dia. Faz upsert pra atualizar placares.
 */
export async function ensureFixturesCached(): Promise<void> {
  const count = await prisma.match.count();
  const newest = await prisma.match.findFirst({
    orderBy: { cachedAt: "desc" },
    select: { cachedAt: true },
  });

  const isStale =
    count === 0 ||
    !newest?.cachedAt ||
    Date.now() - newest.cachedAt.getTime() > ONE_DAY;

  if (!isStale) return;

  const fixtures = await fetchFixtures();
  const now = new Date();

  for (const f of fixtures) {
    await prisma.match.upsert({
      where: { id: f.id },
      create: { ...f, cachedAt: now },
      update: {
        date: f.date,
        homeScore: f.homeScore,
        awayScore: f.awayScore,
        status: f.status,
        venue: f.venue,
        stage: f.stage,
        group: f.group,
        cachedAt: now,
      },
    });
  }
}

/**
 * Garante eventos + lineups de um jogo específico no banco.
 * Re-busca se nunca cacheado, ou se cache velho:
 *  - jogo ao vivo: > 1h
 *  - jogo encerrado: > 24h
 */
export async function ensureMatchDetailCached(matchId: string): Promise<void> {
  const match = await prisma.match.findUnique({
    where: { id: matchId },
    select: { id: true, status: true, cachedAt: true },
  });
  if (!match) return; // rota trata o 404

  const finished = ["FT", "AET", "PEN"].includes(match.status);
  const maxAge = finished ? ONE_DAY : ONE_HOUR;
  const hasDetail = await prisma.matchEvent.count({ where: { matchId } });

  const isStale =
    hasDetail === 0 ||
    !match.cachedAt ||
    Date.now() - match.cachedAt.getTime() > maxAge;

  if (!isStale) return;

  const [events, lineups] = await Promise.all([
    fetchEvents(matchId),
    fetchLineups(matchId),
  ]);

  // Substitui o detalhe anterior numa transação pra não deixar estado parcial.
  await prisma.$transaction([
    prisma.matchEvent.deleteMany({ where: { matchId } }),
    prisma.matchLineup.deleteMany({ where: { matchId } }),
    prisma.matchEvent.createMany({
      data: events.map((e) => ({ ...e, matchId })),
    }),
    prisma.matchLineup.createMany({
      data: lineups.map((l) => ({ ...l, matchId })),
    }),
    prisma.match.update({
      where: { id: matchId },
      data: { cachedAt: new Date() },
    }),
  ]);
}
