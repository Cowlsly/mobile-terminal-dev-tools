import { beforeEach, describe, expect, it, vi } from "vitest";

const api = vi.hoisted(() => ({
  getRepo: vi.fn(),
  getBranch: vi.fn(),
  getTree: vi.fn(),
  getContent: vi.fn(),
}));

vi.mock("@octokit/rest", () => ({
  Octokit: class {
    rest = {
      repos: { get: api.getRepo, getBranch: api.getBranch, getContent: api.getContent },
      git: { getTree: api.getTree },
    };
  },
}));

import {
  listPublicGitHubFiles,
  readPublicGitHubFile,
} from "./github";
import { parseGitHubRepository } from "./github-repository";

beforeEach(() => {
  vi.clearAllMocks();
  api.getRepo.mockResolvedValue({
    data: { private: false, default_branch: "main" },
  });
  api.getBranch.mockResolvedValue({
    data: { commit: { commit: { tree: { sha: "tree-sha" } } } },
  });
  api.getTree.mockResolvedValue({
    data: {
      truncated: false,
      tree: [
        { type: "tree", path: "src", sha: "folder-sha" },
        { type: "blob", path: "src/index.ts", size: 12, sha: "file-sha" },
      ],
    },
  });
});

describe("parseGitHubRepository", () => {
  it.each([
    ["octocat/Hello-World", { owner: "octocat", repo: "Hello-World" }],
    [
      "https://github.com/octocat/Hello-World.git",
      { owner: "octocat", repo: "Hello-World" },
    ],
    [
      "github.com/octocat/Hello-World/",
      { owner: "octocat", repo: "Hello-World" },
    ],
  ])("parses %s", (input, expected) => {
    expect(parseGitHubRepository(input)).toEqual(expected);
  });

  it.each([
    "https://example.com/octocat/repo",
    "http://github.com/octocat/repo",
    "https://user@github.com/octocat/repo",
    "octocat/repo/tree/main",
    "../owner/repo",
    "octocat/repo?tab=readme",
  ])("rejects unsupported repository input %s", (input) => {
    expect(() => parseGitHubRepository(input)).toThrow();
  });

  it("lists public files from the default branch's resolved tree SHA", async () => {
    const repository = { owner: "octocat", repo: "Hello-World" };

    await expect(listPublicGitHubFiles(repository)).resolves.toEqual({
      repository: { ...repository, defaultBranch: "main" },
      files: [{ path: "src/index.ts", size: 12, sha: "file-sha" }],
    });
    expect(api.getBranch).toHaveBeenCalledWith({
      ...repository,
      branch: "main",
    });
    expect(api.getTree).toHaveBeenCalledWith({
      ...repository,
      tree_sha: "tree-sha",
      recursive: "1",
    });
  });

  it("reads public text and refuses oversized files before an API request", async () => {
    const repository = {
      owner: "octocat",
      repo: "Hello-World",
      defaultBranch: "main",
    };
    api.getContent.mockResolvedValue({
      data: {
        type: "file",
        encoding: "base64",
        content: btoa("export const answer = 42;"),
      },
    });

    await expect(
      readPublicGitHubFile(repository, "src/index.ts", 25),
    ).resolves.toBe("export const answer = 42;");
    expect(api.getContent).toHaveBeenCalledWith({
      owner: "octocat",
      repo: "Hello-World",
      path: "src/index.ts",
      ref: "main",
    });

    await expect(
      readPublicGitHubFile(repository, "large.bin", 1_048_577),
    ).rejects.toThrow("larger than 1 MB");
    expect(api.getContent).toHaveBeenCalledTimes(1);
  });
});
