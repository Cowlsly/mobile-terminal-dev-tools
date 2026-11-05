import { FileDiff } from "@pierre/diffs/react";
import { parseDiffFromFile } from "@pierre/diffs";
import { useMemo } from "react";
import type { WorkspaceFile } from "../lib/workspace";

interface CompareViewProps {
  entries: WorkspaceFile[];
  oldPath: string;
  newPath: string;
  onOldPathChange: (path: string) => void;
  onNewPathChange: (path: string) => void;
  contentsByPath: Map<string, string>;
  loading: boolean;
  error: string | null;
  onCompare: () => void;
}

export default function CompareView({
  entries,
  oldPath,
  newPath,
  onOldPathChange,
  onNewPathChange,
  contentsByPath,
  loading,
  error,
  onCompare,
}: CompareViewProps) {
  const oldContents = contentsByPath.get(oldPath);
  const newContents = contentsByPath.get(newPath);
  const fileDiff = useMemo(() => {
    if (oldContents === undefined || newContents === undefined) return null;
    return parseDiffFromFile(
      { name: oldPath, contents: oldContents },
      { name: newPath, contents: newContents },
    );
  }, [newContents, newPath, oldContents, oldPath]);

  return (
    <section className="compare-panel" aria-label="Compare files">
      <div className="compare-controls">
        <label>
          <span>Original</span>
          <select
            value={oldPath}
            onChange={(event) => onOldPathChange(event.target.value)}
            disabled={entries.length === 0}
          >
            {entries.map(({ path }) => (
              <option key={path} value={path}>
                {path}
              </option>
            ))}
          </select>
        </label>
        <span className="compare-arrow" aria-hidden="true">
          →
        </span>
        <label>
          <span>Compare with</span>
          <select
            value={newPath}
            onChange={(event) => onNewPathChange(event.target.value)}
            disabled={entries.length === 0}
          >
            {entries.map(({ path }) => (
              <option key={path} value={path}>
                {path}
              </option>
            ))}
          </select>
        </label>
        <button
          className="button button-primary compare-button"
          onClick={onCompare}
          disabled={!oldPath || !newPath || loading}
        >
          {loading ? "Preparing…" : "Compare"}
        </button>
      </div>
      {error && (
        <p className="notice notice-error" role="alert">
          {error}
        </p>
      )}
      {!entries.length ? (
        <div className="empty-state compact">
          <strong>Load a workspace to compare files</strong>
          <span>Choose a project folder or select individual files.</span>
        </div>
      ) : !fileDiff ? (
        <div className="empty-state compact">
          <strong>Choose two files</strong>
          <span>File contents are read only when you start a comparison.</span>
        </div>
      ) : (
        <div className="diff-container">
          <FileDiff
            key={`${oldPath}:${newPath}`}
            fileDiff={fileDiff}
            options={{ diffStyle: "unified" }}
          />
        </div>
      )}
    </section>
  );
}
