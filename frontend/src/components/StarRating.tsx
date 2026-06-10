import { useState } from "react";

interface StarRatingProps {
  value: number | null;
  onChange?: (value: number) => void;
  size?: number;
  readOnly?: boolean;
}

// Rating 0–5 em incrementos de 0.5 (clique na metade esquerda/direita da estrela).
export function StarRating({
  value,
  onChange,
  size = 22,
  readOnly = false,
}: StarRatingProps) {
  const [hover, setHover] = useState<number | null>(null);
  const shown = hover ?? value ?? 0;

  return (
    <div
      className="flex items-center gap-1"
      onMouseLeave={() => setHover(null)}
      role={readOnly ? undefined : "slider"}
      aria-label="Nota do jogo"
      aria-valuenow={value ?? 0}
      aria-valuemin={0}
      aria-valuemax={5}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const fill = Math.max(0, Math.min(1, shown - (star - 1)));
        return (
          <div
            key={star}
            className="relative"
            style={{ width: size, height: size }}
          >
            <Star size={size} fill={0} />
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${fill * 100}%` }}
            >
              <Star size={size} fill={1} />
            </div>
            {!readOnly && (
              <>
                <button
                  type="button"
                  aria-label={`${star - 0.5} estrelas`}
                  className="absolute inset-y-0 left-0 w-1/2 cursor-pointer"
                  onMouseEnter={() => setHover(star - 0.5)}
                  onClick={() => onChange?.(star - 0.5)}
                />
                <button
                  type="button"
                  aria-label={`${star} estrelas`}
                  className="absolute inset-y-0 right-0 w-1/2 cursor-pointer"
                  onMouseEnter={() => setHover(star)}
                  onClick={() => onChange?.(star)}
                />
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

function Star({ size, fill }: { size: number; fill: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={fill ? "text-amber-bright" : "text-faint"}
      style={{ display: "block" }}
    >
      <path
        d="M12 2.5l2.7 6.06 6.6.57-5 4.34 1.5 6.45L12 16.9l-5.8 3.5 1.5-6.45-5-4.34 6.6-.57z"
        fill={fill ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={fill ? 0 : 1.5}
        strokeLinejoin="round"
      />
    </svg>
  );
}
