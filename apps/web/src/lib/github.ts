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

export async function fetchLatestCommit(): Promise<GitHubCommit> {
  const response = await fetch(
    "https://api.github.com/repos/work-wide-web-kmutt/tarang-rian/commits/main"
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch latest commit: ${response.statusText}`);
  }

  return response.json() as Promise<GitHubCommit>;
}
