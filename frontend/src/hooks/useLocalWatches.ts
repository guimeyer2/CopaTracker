import { useCallback, useSyncExternalStore } from "react";

// Estado local de "assistido + nota" guardado no localStorage.
// É um PLACEHOLDER pra demonstrar a UX (estilo Letterboxd) enquanto a auth
// Google e a rota /watches não entram. Depois isso vira chamada ao backend.

const KEY = "copatracker:watches";

type WatchMap = Record<string, { rating: number | null }>;

function read(): WatchMap {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "{}") as WatchMap;
  } catch {
    return {};
  }
}

const listeners = new Set<() => void>();
let snapshot = read();

function emit() {
  snapshot = read();
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useLocalWatches() {
  const watches = useSyncExternalStore(subscribe, () => snapshot);

  const toggleWatched = useCallback((matchId: string) => {
    const current = read();
    if (current[matchId]) {
      delete current[matchId];
    } else {
      current[matchId] = { rating: null };
    }
    localStorage.setItem(KEY, JSON.stringify(current));
    emit();
  }, []);

  const setRating = useCallback((matchId: string, rating: number | null) => {
    const current = read();
    current[matchId] = { rating };
    localStorage.setItem(KEY, JSON.stringify(current));
    emit();
  }, []);

  return { watches, toggleWatched, setRating };
}
