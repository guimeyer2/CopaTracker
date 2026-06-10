import { prisma } from "./services/prisma";
import { fetchFixtures } from "./services/apifootball";

// Script one-shot pra popular o banco com os jogos da Copa 2026.
// Uso: npm run seed
async function main() {
  console.log("⚽ Buscando fixtures da API-Football...");
  const fixtures = await fetchFixtures();
  console.log(`   ${fixtures.length} jogos recebidos.`);

  const now = new Date();
  let created = 0;

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
    created += 1;
  }

  console.log(`✅ ${created} jogos salvos no banco.`);
}

main()
  .catch((err) => {
    console.error("❌ Seed falhou:", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
