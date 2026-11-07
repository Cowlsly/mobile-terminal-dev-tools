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

describe('GitHub response boundaries', () => {
  const repository = { owner: 'octocat', repo: 'Hello-World', defaultBranch: 'main' };
  it('opens an empty text file', async () => {
    api.getContent.mockResolvedValue({data: {type: 'file', encoding: 'base64', content: '', size: 0}});
    await expect(readPublicGitHubFile(repository, 'empty.txt', 0)).resolves.toBe('');
  });
  it.each([
    {type: 'file', encoding: 'base64', content: btoa('changed'), size: 1048577},
    {type: 'file', encoding: 'base64', content: btoa('x'.repeat(1048577))},
  ])('rejects a response that grew beyond the listed size', async (data) => {
    api.getContent.mockResolvedValue({data});
    await expect(readPublicGitHubFile(repository, 'changed.txt', 1)).rejects.toThrow('larger than 1 MB');
  });
  it.each([
    [{type: 'file', encoding: 'none', content: ''}, 'text content'],
    [{type: 'file', encoding: 'base64', content: btoa('\0')}, 'binary'],
    [{type: 'file', encoding: 'base64', content: btoa('\xff')}, 'UTF-8'],
  ])('rejects unsupported response data', async (data, error) => {
    api.getContent.mockResolvedValue({data});
    await expect(readPublicGitHubFile(repository, 'file', 1)).rejects.toThrow(error);
  });
  it('rejects private repositories before fetching a tree', async () => {
    api.getRepo.mockResolvedValue({data: {private: true}});
    await expect(listPublicGitHubFiles(repository)).rejects.toThrow('Only public');
    expect(api.getTree).not.toHaveBeenCalled();
  });
  it('rejects incomplete repository trees', async () => {
    api.getTree.mockResolvedValue({data: {truncated: true, tree: []}});
    await expect(listPublicGitHubFiles(repository)).rejects.toThrow('truncated');
  });
});
