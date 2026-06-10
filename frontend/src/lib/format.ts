import type { Match } from "../types";

// Helpers de data/hora — sempre convertendo o ISO (UTC) pro fuso local do usuário.

const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

const weekdayFmt = new Intl.DateTimeFormat("pt-BR", {
  weekday: "short",
  timeZone: tz,
});
const dayFmt = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  timeZone: tz,
});
const monthFmt = new Intl.DateTimeFormat("pt-BR", {
  month: "short",
  timeZone: tz,
});
const timeFmt = new Intl.DateTimeFormat("pt-BR", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: tz,
});

/** Chave de agrupamento por dia local (YYYY-MM-DD). */
export function dayKey(iso: string): string {
  const d = new Date(iso);
  // Usa componentes locais pra não vazar pro dia seguinte por causa do UTC.
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

export function formatTime(iso: string): string {
  return timeFmt.format(new Date(iso));
}

export function formatWeekday(iso: string): string {
  return weekdayFmt.format(new Date(iso)).replace(".", "").toUpperCase();
}

export function formatDayNumber(iso: string): string {
  return dayFmt.format(new Date(iso));
}

export function formatMonth(iso: string): string {
  return monthFmt.format(new Date(iso)).replace(".", "").toUpperCase();
}

export interface MatchDay {
  key: string;
  iso: string;
  matches: Match[];
}

/** Agrupa jogos por dia local, preservando a ordem cronológica. */
export function groupByDay(matches: Match[]): MatchDay[] {
  const groups = new Map<string, MatchDay>();
  for (const match of matches) {
    const key = dayKey(match.date);
    let group = groups.get(key);
    if (!group) {
      group = { key, iso: match.date, matches: [] };
      groups.set(key, group);
    }
    group.matches.push(match);
  }
  return [...groups.values()];
}

const todayKey = dayKey(new Date().toISOString());

export function isToday(iso: string): boolean {
  return dayKey(iso) === todayKey;
}
