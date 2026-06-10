import type { Match } from "../types";

// Dados de demonstração pra desenvolver o frontend sem o backend/banco prontos.
// São substituídos pelos dados reais assim que GET /matches retorna jogos.
// Datas relativas a "hoje" pra a home sempre ter conteúdo vivo.

function at(dayOffset: number, hour: number, minute = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + dayOffset);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

const flag = (code: string) => `https://flagcdn.com/w80/${code}.png`;

export const mockMatches: Match[] = [
  {
    id: "mock-1",
    date: at(-1, 17),
    homeTeam: "Brasil",
    awayTeam: "Sérvia",
    homeFlag: flag("br"),
    awayFlag: flag("rs"),
    homeScore: 2,
    awayScore: 0,
    status: "FT",
    stage: "Group Stage",
    group: "Group G",
    venue: "MetLife Stadium",
  },
  {
    id: "mock-2",
    date: at(-1, 14),
    homeTeam: "Argentina",
    awayTeam: "México",
    homeFlag: flag("ar"),
    awayFlag: flag("mx"),
    homeScore: 2,
    awayScore: 1,
    status: "FT",
    stage: "Group Stage",
    group: "Group C",
    venue: "Estadio Azteca",
  },
  {
    id: "mock-3",
    date: at(0, 13),
    homeTeam: "França",
    awayTeam: "Dinamarca",
    homeFlag: flag("fr"),
    awayFlag: flag("dk"),
    homeScore: 1,
    awayScore: 1,
    status: "2H",
    stage: "Group Stage",
    group: "Group D",
    venue: "SoFi Stadium",
  },
  {
    id: "mock-4",
    date: at(0, 16),
    homeTeam: "Espanha",
    awayTeam: "Japão",
    homeFlag: flag("es"),
    awayFlag: flag("jp"),
    homeScore: null,
    awayScore: null,
    status: "NS",
    stage: "Group Stage",
    group: "Group E",
    venue: "AT&T Stadium",
  },
  {
    id: "mock-5",
    date: at(0, 19),
    homeTeam: "Inglaterra",
    awayTeam: "Países Baixos",
    homeFlag: flag("gb-eng"),
    awayFlag: flag("nl"),
    homeScore: null,
    awayScore: null,
    status: "NS",
    stage: "Group Stage",
    group: "Group B",
    venue: "Lumen Field",
  },
  {
    id: "mock-6",
    date: at(1, 13),
    homeTeam: "Portugal",
    awayTeam: "Uruguai",
    homeFlag: flag("pt"),
    awayFlag: flag("uy"),
    homeScore: null,
    awayScore: null,
    status: "NS",
    stage: "Group Stage",
    group: "Group H",
    venue: "Hard Rock Stadium",
  },
  {
    id: "mock-7",
    date: at(1, 16),
    homeTeam: "Alemanha",
    awayTeam: "Croácia",
    homeFlag: flag("de"),
    awayFlag: flag("hr"),
    homeScore: null,
    awayScore: null,
    status: "NS",
    stage: "Group Stage",
    group: "Group F",
    venue: "Arrowhead Stadium",
  },
  {
    id: "mock-8",
    date: at(2, 18),
    homeTeam: "Canadá",
    awayTeam: "Marrocos",
    homeFlag: flag("ca"),
    awayFlag: flag("ma"),
    homeScore: null,
    awayScore: null,
    status: "NS",
    stage: "Group Stage",
    group: "Group A",
    venue: "BMO Field",
  },
];
