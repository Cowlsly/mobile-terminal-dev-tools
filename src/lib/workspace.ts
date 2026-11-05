export const MAX_WORKSPACE_FILES = 5_000;
export const MAX_TEXT_FILE_BYTES = 1_048_576;

export interface WorkspaceFile {
  path: string;
  file: File;
  size?: number;
}

export function getWorkspacePath(file: File): string {
  const relativePath = (file as File & { webkitRelativePath?: string })
    .webkitRelativePath;
  const rawPath = relativePath || file.name;

  return rawPath
    .replaceAll("\\", "/")
    .split("/")
    .filter((segment) => segment && segment !== "." && segment !== "..")
    .join("/");
}

export function createWorkspaceFiles(files: FileList | File[]): WorkspaceFile[] {
  if (files.length > MAX_WORKSPACE_FILES) {
    throw new Error(
      `This workspace contains ${files.length.toLocaleString()} files. The limit is ${MAX_WORKSPACE_FILES.toLocaleString()}.`,
    );
  }

  const uniqueFiles = new Map<string, WorkspaceFile>();
  for (const file of Array.from(files)) {
    const basePath = getWorkspacePath(file);
    if (!basePath) continue;

    let path = basePath;
    let suffix = 2;
    const extensionIndex = basePath.lastIndexOf(".");
    const stem =
      extensionIndex > basePath.lastIndexOf("/")
        ? basePath.slice(0, extensionIndex)
        : basePath;
    const extension =
      extensionIndex > basePath.lastIndexOf("/")
        ? basePath.slice(extensionIndex)
        : "";
    while (uniqueFiles.has(path)) {
      path = `${stem} (${suffix})${extension}`;
      suffix += 1;
    }
    uniqueFiles.set(path, { path, file });
  }

  if (uniqueFiles.size === 0) {
    throw new Error("No readable files were selected.");
  }

  return Array.from(uniqueFiles.values()).sort((left, right) =>
    left.path.localeCompare(right.path),
  );
}

export async function readWorkspaceText(file: File): Promise<string> {
  if (file.size > MAX_TEXT_FILE_BYTES) {
    throw new Error(
      `This file is larger than ${formatBytes(MAX_TEXT_FILE_BYTES)}. Select a smaller text file to preview it.`,
    );
  }

  const buffer = await file.arrayBuffer();
  if (new Uint8Array(buffer).includes(0)) {
    throw new Error("This file appears to be binary and cannot be previewed as text.");
  }
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(buffer);
  } catch {
    throw new Error("This file is not valid UTF-8 text and cannot be previewed.");
  }
}

export function formatBytes(bytes: number): string {
  if (bytes < 1_024) return `${bytes} B`;
  if (bytes < 1_048_576) return `${(bytes / 1_024).toFixed(1)} KB`;
  return `${(bytes / 1_048_576).toFixed(1)} MB`;
}

export function getWorkspaceName(paths: string[]): string {
  if (!paths.length) return "No workspace";
  const topLevelSegments = new Set(paths.map((path) => path.split("/")[0]));
  const hasNestedPath = paths.some((path) => path.includes("/"));
  if (topLevelSegments.size === 1 && hasNestedPath) {
    return paths[0].split("/")[0];
  }
  return "Selected files";
}
