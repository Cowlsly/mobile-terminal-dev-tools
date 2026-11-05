import { describe, expect, it } from "vitest";
import {
  createWorkspaceFiles,
  getWorkspaceName,
  getWorkspacePath,
  readWorkspaceText,
} from "./workspace";

describe("workspace paths", () => {
  it("uses safe relative paths for directory selections", () => {
    const file = Object.assign(new File(["ok"], "main.ts"), {
      webkitRelativePath: "project/src/main.ts",
    });

    expect(getWorkspacePath(file)).toBe("project/src/main.ts");
    expect(getWorkspaceName(["project/src/main.ts"])).toBe("project");
  });

  it("keeps duplicate filenames instead of silently dropping a selection", () => {
    const files = [
      Object.assign(new File(["one"], "readme.md"), {
        webkitRelativePath: "one/readme.md",
      }),
      Object.assign(new File(["two"], "readme.md"), {
        webkitRelativePath: "two/readme.md",
      }),
      new File(["three"], "readme.md"),
    ];

    expect(createWorkspaceFiles(files).map(({ path }) => path)).toEqual([
      "one/readme.md",
      "readme.md",
      "two/readme.md",
    ]);
  });

  it("rejects a workspace exceeding the file count limit", () => {
    const tooManyFiles = Array.from({ length: 5_001 }, (_, index) =>
      new File([""], `${index}.txt`),
    );

    expect(() => createWorkspaceFiles(tooManyFiles)).toThrow(
      "The limit is 5,000",
    );
  });
});

describe("local file reading", () => {
  it("reads UTF-8 text and rejects binary or oversized files", async () => {
    await expect(readWorkspaceText(new File(["hello"], "note.txt"))).resolves.toBe(
      "hello",
    );
    await expect(
      readWorkspaceText(new File([new Uint8Array([0, 1])], "image.bin")),
    ).rejects.toThrow("binary");
    await expect(
      readWorkspaceText(new File(["x".repeat(1_048_577)], "large.txt")),
    ).rejects.toThrow("larger than 1.0 MB");
  });
});
