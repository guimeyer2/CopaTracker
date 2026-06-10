import { useNavigate } from "react-router-dom";
import type { Match } from "../types";
import { hasScore, isFinished, isLive } from "../types";
import { formatTime } from "../lib/format";
import { StarRating } from "./StarRating";
import { useLocalWatches } from "../hooks/useLocalWatches";

interface MatchCardProps {
  match: Match;
  index: number;
}

export function MatchCard({ match, index }: MatchCardProps) {
  const navigate = useNavigate();
  const { watches, toggleWatched, setRating } = useLocalWatches();
  const watch = watches[match.id];
  const watched = Boolean(watch);
  const live = isLive(match);

  return (
    <article
      onClick={() => navigate(`/match/${match.id}`)}
      onKeyDown={(e) => {
        if (e.key === "Enter") navigate(`/match/${match.id}`);
      }}
      tabIndex={0}
      role="link"
      aria-label={`${match.homeTeam} contra ${match.awayTeam}`}
      style={{ animationDelay: `${Math.min(index, 8) * 45}ms` }}
      className={`group animate-rise relative cursor-pointer overflow-hidden rounded-xl border bg-surface/70 backdrop-blur-sm transition-all duration-300 outline-none
        ${
          watched
            ? "border-emerald/40"
            : "border-line hover:border-amber/40"
        }
        hover:-translate-y-0.5 focus-visible:border-amber/60`}
    >
      {/* Faixa lateral: esmeralda se assistido, âmbar no hover */}
      <span
        aria-hidden
        className={`absolute inset-y-0 left-0 w-1 transition-colors
          ${watched ? "bg-emerald" : "bg-transparent group-hover:bg-amber"}`}
      />

      {/* Meta: fase / grupo / estádio */}
      <div className="flex items-center justify-between px-5 pt-3.5 text-[11px] font-medium tracking-[0.14em] text-faint uppercase">
        <span>
          {match.stage}
          {match.group ? ` · ${match.group}` : ""}
        </span>
        {match.venue && (
          <span className="hidden truncate sm:inline">{match.venue}</span>
        )}
      </div>

      {/* Confronto */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-5 py-3 sm:gap-6">
        <TeamSide
          name={match.homeTeam}
          flag={match.homeFlag}
          align="right"
        />

        <div className="flex min-w-[84px] flex-col items-center justify-center">
          {hasScore(match) ? (
            <div className="tabular flex items-baseline gap-2 font-display text-4xl leading-none font-semibold sm:text-5xl">
              <span>{match.homeScore}</span>
              <span className="text-faint text-2xl">:</span>
              <span>{match.awayScore}</span>
            </div>
          ) : (
            <div className="tabular font-display text-2xl leading-none font-medium text-bone/90 sm:text-3xl">
              {formatTime(match.date)}
            </div>
          )}
          <StatusChip live={live} finished={isFinished(match)} />
        </div>

        <TeamSide name={match.awayTeam} flag={match.awayFlag} align="left" />
      </div>

      {/* Assistido + nota (placeholder local até auth + /watches) */}
      <div
        className="flex items-center justify-between gap-3 border-t border-line px-5 py-2.5"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => toggleWatched(match.id)}
          className={`flex items-center gap-2 text-xs font-medium tracking-wide transition-colors
            ${watched ? "text-emerald" : "text-muted hover:text-bone"}`}
        >
          <span
            className={`grid h-4 w-4 place-items-center rounded-full border text-[10px]
              ${watched ? "border-emerald bg-emerald text-ink" : "border-faint"}`}
          >
            {watched ? "✓" : ""}
          </span>
          {watched ? "Assistido" : "Marcar"}
        </button>

        <div className={watched ? "opacity-100" : "opacity-40"}>
          <StarRating
            value={watch?.rating ?? null}
            size={18}
            readOnly={!watched}
            onChange={(r) => setRating(match.id, r)}
          />
        </div>
      </div>
    </article>
  );
}

function TeamSide({
  name,
  flag,
  align,
}: {
  name: string;
  flag: string | null;
  align: "left" | "right";
}) {
  return (
    <div
      className={`flex items-center gap-2.5 sm:gap-3 ${
        align === "right" ? "flex-row-reverse text-right" : "text-left"
      }`}
    >
      <Flag src={flag} alt={name} />
      <span className="font-display text-lg leading-tight font-semibold text-balance sm:text-2xl">
        {name}
      </span>
    </div>
  );
}

function Flag({ src, alt }: { src: string | null; alt: string }) {
  return (
    <span className="relative h-7 w-10 shrink-0 overflow-hidden rounded-[3px] ring-1 ring-line-strong sm:h-8 sm:w-11">
      {src ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="block h-full w-full bg-surface-2" />
      )}
    </span>
  );
}

function StatusChip({ live, finished }: { live: boolean; finished: boolean }) {
  if (live) {
    return (
      <span className="mt-1.5 flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.18em] text-live uppercase">
        <span className="animate-live h-1.5 w-1.5 rounded-full bg-live" />
        Ao vivo
      </span>
    );
  }
  if (finished) {
    return (
      <span className="mt-1.5 text-[10px] font-semibold tracking-[0.18em] text-faint uppercase">
        Encerrado
      </span>
    );
  }
  return (
    <span className="mt-1.5 text-[10px] font-semibold tracking-[0.18em] text-amber/80 uppercase">
      A seguir
    </span>
  );
}
