import { codeToHtml, type Lang } from "@pierre/highlights";
import { pierreDark } from "@pierre/highlights/themes";
import { useEffect, useState } from "react";
import { formatBytes, type WorkspaceFile } from "../lib/workspace";

const languageByExtension: Record<string, Lang> = {
  c: "c",
  cjs: "javascript",
  css: "css",
  go: "go",
  h: "c",
  html: "html",
  java: "java",
  js: "javascript",
  jsx: "jsx",
  json: "json",
  md: "markdown",
  mjs: "javascript",
  py: "python",
  rs: "rust",
  sh: "bash",
  sql: "sql",
  toml: "toml",
  ts: "typescript",
  tsx: "tsx",
  txt: "txt",
  yaml: "yaml",
  yml: "yaml",
};

function getLanguage(path: string): Lang {
  const extension = path.split(".").at(-1)?.toLowerCase() ?? "txt";
  return languageByExtension[extension] ?? "txt";
}

interface CodeViewerProps {
  entry: WorkspaceFile;
  contents: string;
}

export default function CodeViewer({ entry, contents }: CodeViewerProps) {
  const [highlightedHtml, setHighlightedHtml] = useState("");
  const [highlightError, setHighlightError] = useState(false);

  useEffect(() => {
    try {
      const html = codeToHtml(contents, {
        lang: getLanguage(entry.path),
        theme: pierreDark,
      });
      setHighlightedHtml(new TextDecoder().decode(html));
      setHighlightError(false);
    } catch {
      setHighlightedHtml("");
      setHighlightError(true);
    }
  }, [contents, entry.path]);

  return (
    <section className="code-panel" aria-label={`File contents: ${entry.path}`}>
      <div className="file-toolbar">
        <div className="file-heading">
          <strong title={entry.path}>{entry.path}</strong>
          <span>{formatBytes(entry.size ?? entry.file.size)}</span>
        </div>
        <span className="language-badge">{getLanguage(entry.path)}</span>
      </div>
      {highlightError ? (
        <pre className="plain-code">
          <code>{contents}</code>
        </pre>
      ) : (
        <div
          className="highlighted-code"
          dangerouslySetInnerHTML={{ __html: highlightedHtml }}
        />
      )}
    </section>
  );
}
