import { useQuery } from "@tanstack/react-query";
import { getMatches, getMatch } from "../services/matches";

export function useMatches() {
  return useQuery({
    queryKey: ["matches"],
    queryFn: getMatches,
    staleTime: 1000 * 60 * 5, // 5 min — o backend já cacheia o resto
  });
}

export function useMatch(id: string | undefined) {
  return useQuery({
    queryKey: ["match", id],
    queryFn: () => getMatch(id!),
    enabled: Boolean(id),
  });
}
