import { useQuery } from "@tanstack/react-query";
import { fetchLatestCommit } from "@/lib/github";

export function useLatestCommit() {
  return useQuery({
    queryKey: ["latest-commit"],
    queryFn: fetchLatestCommit,
    staleTime: 5 * 60 * 1000,
  });
}
