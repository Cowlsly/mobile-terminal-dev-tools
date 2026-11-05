export interface PublicGitHubRepository {
  owner: string;
  repo: string;
  defaultBranch: string;
}

export interface PublicGitHubFile {
  path: string;
  size: number;
  sha: string;
}

export function parseGitHubRepository(
  input: string,
): Omit<PublicGitHubRepository, "defaultBranch"> {
  const value = input.trim();
  let path = value;

  if (value.includes("://")) {
    let url: URL;
    try {
      url = new URL(value);
    } catch {
      throw new Error("Enter a GitHub repository URL or owner/repository.");
    }

    if (
      url.protocol !== "https:" ||
      url.hostname.toLowerCase() !== "github.com" ||
      url.username ||
      url.password ||
      url.search ||
      url.hash
    ) {
      throw new Error("Only HTTPS URLs from github.com are supported.");
    }
    path = url.pathname;
  } else {
    path = path.replace(/^(?:www\.)?github\.com\//i, "");
  }

  const segments = path.split("/").filter(Boolean);
  if (segments.length !== 2) {
    throw new Error("Enter a repository as owner/repository.");
  }

  const [owner, rawRepo] = segments;
  const repo = rawRepo.endsWith(".git") ? rawRepo.slice(0, -4) : rawRepo;
  if (
    !/^[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?$/.test(owner) ||
    !/^[A-Za-z0-9._-]+$/.test(repo) ||
    repo === "." ||
    repo === ".."
  ) {
    throw new Error("That does not look like a valid GitHub repository.");
  }

  return { owner, repo };
}
