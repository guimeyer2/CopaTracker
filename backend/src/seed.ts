import { prisma } from "./services/prisma";
import { fetchWorldCupFixtures } from "./services/thesportsdb";
import { upsertFixtures } from "./services/cache";

// Script one-shot pra popular o banco com os jogos da Copa 2026 (TheSportsDB).
// Re-rodar é seguro: preserva placar/gols editados à mão. Uso: npm run seed
async function main() {
  console.log("⚽ Buscando fixtures da Copa 2026 (TheSportsDB)...");
  const fixtures = await fetchWorldCupFixtures();
  console.log(`   ${fixtures.length} jogos recebidos.`);

  await upsertFixtures(fixtures);

  console.log(`✅ ${fixtures.length} jogos salvos no banco.`);
}

main()
  .catch((err) => {
    console.error("❌ Seed falhou:", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
