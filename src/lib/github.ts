import { Octokit } from "@octokit/rest";
import {
  MAX_TEXT_FILE_BYTES,
  MAX_WORKSPACE_FILES,
} from "./workspace";
import type {
  PublicGitHubFile,
  PublicGitHubRepository,
} from "./github-repository";

const octokit = new Octokit({ request: { timeout: 15_000 } });

export function parseGitHubRepository(input: string): Omit<
  PublicGitHubRepository,
  "defaultBranch"
> {
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

export async function listPublicGitHubFiles(
  repository: Omit<PublicGitHubRepository, "defaultBranch">,
): Promise<{ repository: PublicGitHubRepository; files: PublicGitHubFile[] }> {
  const { data: repoData } = await octokit.rest.repos.get(repository);
  if (repoData.private) {
    throw new Error("Only public GitHub repositories can be opened.");
  }
  const { data: branchData } = await octokit.rest.repos.getBranch({
    ...repository,
    branch: repoData.default_branch,
  });

  const { data: treeData } = await octokit.rest.git.getTree({
    ...repository,
    tree_sha: branchData.commit.commit.tree.sha,
    recursive: "1",
  });
  if (treeData.truncated) {
    throw new Error(
      "GitHub returned a truncated file tree. Try a smaller repository.",
    );
  }

  const files = treeData.tree
    .filter((item) => item.type === "blob" && item.path)
    .map((item) => ({
      path: item.path!,
      size: item.size ?? 0,
      sha: item.sha,
    }));
  if (files.length > MAX_WORKSPACE_FILES) {
    throw new Error(
      `This repository has more than ${MAX_WORKSPACE_FILES.toLocaleString()} files. Try a smaller repository.`,
    );
  }

  return {
    repository: { ...repository, defaultBranch: repoData.default_branch },
    files: files.sort((left, right) => left.path.localeCompare(right.path)),
  };
}

export async function readPublicGitHubFile(
  repository: PublicGitHubRepository,
  path: string,
  expectedSize: number,
): Promise<string> {
  if (expectedSize > MAX_TEXT_FILE_BYTES) {
    throw new Error(
      `This file is larger than ${MAX_TEXT_FILE_BYTES / 1_048_576} MB. Choose a smaller text file to preview it.`,
    );
  }

  const { data } = await octokit.rest.repos.getContent({
    owner: repository.owner,
    repo: repository.repo,
    path,
    ref: repository.defaultBranch,
  });
  if (Array.isArray(data) || data.type !== "file" || !data.content) {
    throw new Error("GitHub did not return this file as text content.");
  }

  const decoded = atob(data.content.replace(/\s/g, ""));
  const bytes = Uint8Array.from(decoded, (character) =>
    character.charCodeAt(0),
  );
  if (bytes.includes(0)) {
    throw new Error("This file appears to be binary and cannot be previewed as text.");
  }

  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    throw new Error("This file is not valid UTF-8 text and cannot be previewed.");
  }
}
