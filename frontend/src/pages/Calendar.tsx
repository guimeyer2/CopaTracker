import { useMatches } from "../hooks/useMatches";
import { groupByDay } from "../lib/format";
import { DayHeader } from "../components/DayHeader";
import { MatchCard } from "../components/MatchCard";

export function Calendar() {
  const { data: matches, isLoading, isError } = useMatches();

  return (
    <div className="mx-auto max-w-3xl px-4 pb-24">
      <Hero count={matches?.length ?? 0} />

      {isLoading && <SkeletonList />}

      {isError && !matches && (
        <p className="py-10 text-center text-muted">
          Não foi possível carregar os jogos.
        </p>
      )}

      {matches && matches.length > 0 && (
        <div className="space-y-8">
          {groupByDay(matches).map((day) => (
            <section key={day.key}>
              <DayHeader iso={day.iso} />
              <div className="space-y-2.5">
                {day.matches.map((match, i) => (
                  <MatchCard key={match.id} match={match} index={i} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function Hero({ count }: { count: number }) {
  return (
    <div className="relative overflow-hidden py-10">
      <div
        aria-hidden
        className="pitch-lines absolute inset-0 opacity-40 [mask-image:linear-gradient(180deg,black,transparent)]"
      />
      <div className="relative">
        <p className="mb-2 text-xs font-semibold tracking-[0.3em] text-amber uppercase">
          Copa do Mundo · 2026
        </p>
        <h1 className="font-display text-5xl leading-[0.95] font-bold text-balance sm:text-6xl">
          Cada jogo,{" "}
          <span className="text-amber">sua história</span>.
        </h1>
        <p className="mt-3 max-w-md text-sm text-muted">
          Marque o que assistiu, dê sua nota e veja a Copa virar estatística.
          {count > 0 && (
            <span className="text-faint"> · {count} jogos no calendário</span>
          )}
        </p>
      </div>
    </div>
  );
}

function SkeletonList() {
  return (
    <div className="space-y-2.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="h-[132px] animate-pulse rounded-xl border border-line bg-surface/50"
        />
      ))}
    </div>
  );
}
