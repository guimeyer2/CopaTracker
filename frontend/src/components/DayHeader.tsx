import {
  formatDayNumber,
  formatMonth,
  formatWeekday,
  isToday,
} from "../lib/format";

export function DayHeader({ iso }: { iso: string }) {
  const today = isToday(iso);
  return (
    <div className="sticky top-[57px] z-20 -mx-1 mb-3 bg-ink/85 px-1 py-2 backdrop-blur-md">
      <div className="flex items-baseline gap-3 border-b border-line-strong pb-2">
        <span
          className={`font-display text-2xl leading-none font-semibold tabular ${
            today ? "text-amber" : "text-bone"
          }`}
        >
          {formatDayNumber(iso)}
        </span>
        <span className="font-display text-sm font-medium tracking-[0.2em] text-muted uppercase">
          {formatMonth(iso)}
        </span>
        <span className="text-xs font-medium tracking-[0.2em] text-faint uppercase">
          {formatWeekday(iso)}
        </span>
        {today && (
          <span className="ml-auto rounded-full bg-amber/15 px-2.5 py-0.5 text-[10px] font-semibold tracking-[0.18em] text-amber uppercase">
            Hoje
          </span>
        )}
      </div>
    </div>
  );
}
