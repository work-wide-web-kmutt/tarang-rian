import { z } from "zod";

export interface GitHubCommit {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      email: string;
      date: string;
    };
  };
  html_url: string;
}

const githubCommitSchema = z.object({
  commit: z.object({
    author: z.object({
      date: z.string(),
      email: z.string(),
      name: z.string(),
    }),
    message: z.string(),
  }),
  html_url: z.string(),
  sha: z.string(),
});

export async function fetchLatestCommit(): Promise<GitHubCommit> {
  const response = await fetch(
    "https://api.github.com/repos/work-wide-web-kmutt/tarang-rian/commits/main"
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch latest commit: ${response.statusText}`);
  }

  const data: unknown = await response.json();
  return githubCommitSchema.parse(data);
}
