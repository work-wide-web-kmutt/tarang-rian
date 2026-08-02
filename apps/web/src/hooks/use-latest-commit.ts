import { useQuery } from "@tanstack/react-query";

import { fetchLatestCommit } from "@/lib/github";

export function useLatestCommit() {
  return useQuery({
    queryFn: fetchLatestCommit,
    queryKey: ["latest-commit"],
    staleTime: 5 * 60 * 1000,
  });
}
