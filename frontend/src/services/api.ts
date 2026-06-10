// Cliente HTTP fino pro backend. `credentials: include` pra mandar o cookie
// de sessão quando a auth entrar (próximas seções).

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error(`GET ${path} → ${res.status}`);
  }
  return res.json() as Promise<T>;
}
