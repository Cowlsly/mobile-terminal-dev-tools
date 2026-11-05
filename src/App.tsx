import { FileTree, useFileTree } from "@pierre/trees/react";
import {
  ArrowLeftRight,
  Code2,
  Files,
  FolderOpen,
  GitBranch,
  GitCompareArrows,
  ShieldCheck,
} from "lucide-react";
import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type {
  PublicGitHubFile,
  PublicGitHubRepository,
} from "./lib/github-repository";
import { parseGitHubRepository } from "./lib/github-repository";
import {
  createWorkspaceFiles,
  getWorkspaceName,
  readWorkspaceText,
  type WorkspaceFile,
} from "./lib/workspace";

type AppView = "explorer" | "compare";

const CodeViewer = lazy(() => import("./components/CodeViewer"));
const CompareView = lazy(() => import("./components/CompareView"));

const demoFiles = [
  new File(
    [
      [
        "export function greet(name: string) {",
        '  return `Hello, ${name}!`;',
        "}",
        "",
        "console.log(greet('world'));",
      ].join("\n"),
    ],
    "src/greeting.ts",
    { type: "text/plain" },
  ),
  new File(
    [
      [
        "export function greet(name: string) {",
        '  return `Welcome back, ${name}.`;',
        "}",
        "",
        "console.log(greet('world'));",
      ].join("\n"),
    ],
    "src/greeting-updated.ts",
    { type: "text/plain" },
  ),
  new File(
    [
      [
        "# Mobile Terminal Dev Tools",
        "",
        "Browse and compare code locally.",
      ].join("\n"),
    ],
    "README.md",
    { type: "text/markdown" },
  ),
];

export default function App() {
  const [entries, setEntries] = useState<WorkspaceFile[]>([]);
  const [selectedPath, setSelectedPath] = useState("");
  const [view, setView] = useState<AppView>("explorer");
  const [contentsByPath, setContentsByPath] = useState(
    () => new Map<string, string>(),
  );
  const [loadingPath, setLoadingPath] = useState("");
  const [compareLoading, setCompareLoading] = useState(false);
  const [error, setError] = useState("");
  const [compareError, setCompareError] = useState("");
  const [oldPath, setOldPath] = useState("");
  const [newPath, setNewPath] = useState("");
  const [githubInput, setGithubInput] = useState("");
  const [githubFormOpen, setGithubFormOpen] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);
  const entriesRef = useRef(new Map<string, File>());
  const contentsByPathRef = useRef(new Map<string, string>());
  const githubRepositoryRef = useRef<PublicGitHubRepository | null>(null);
  const githubFilesRef = useRef(new Map<string, PublicGitHubFile>());
  const requestId = useRef(0);
  const workspaceLoadId = useRef(0);
  const directoryInput = useRef<HTMLInputElement>(null);
  const filesInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    directoryInput.current?.setAttribute("webkitdirectory", "");
  }, []);

  const readPath = useCallback(async (path: string): Promise<string> => {
    const cached = contentsByPathRef.current.get(path);
    if (cached !== undefined) return cached;

    const repository = githubRepositoryRef.current;
    let contents: string;
    if (repository) {
      const metadata = githubFilesRef.current.get(path);
      if (!metadata) throw new Error("That file is no longer in the workspace.");
      const { readPublicGitHubFile } = await import("./lib/github");
      contents = await readPublicGitHubFile(repository, path, metadata.size);
      if (
        githubRepositoryRef.current !== repository ||
        githubFilesRef.current.get(path) !== metadata
      ) {
        throw new Error("The workspace changed while this file was loading.");
      }
    } else {
      const file = entriesRef.current.get(path);
      if (!file) throw new Error("That file is no longer in the workspace.");
      contents = await readWorkspaceText(file);
      if (entriesRef.current.get(path) !== file) {
        throw new Error("The workspace changed while this file was loading.");
      }
    }

    contentsByPathRef.current.set(path, contents);
    setContentsByPath((current) => {
      const next = new Map(current);
      next.set(path, contents);
      return next;
    });
    return contents;
  }, []);

  const openPath = useCallback(
    async (path: string) => {
      const id = ++requestId.current;
      setSelectedPath(path);
      setLoadingPath(path);
      setError("");
      setView("explorer");
      try {
        await readPath(path);
      } catch (cause) {
        if (id === requestId.current) {
          setError(cause instanceof Error ? cause.message : "Unable to read this file.");
        }
      } finally {
        if (id === requestId.current) setLoadingPath("");
      }
    },
    [readPath],
  );

  const paths = useMemo(() => entries.map(({ path }) => path), [entries]);
  const handleTreeSelection = useCallback(
    (selectedPaths: readonly string[]) => {
      const path = selectedPaths[0];
      if (path) void openPath(path);
    },
    [openPath],
  );
  const { model } = useFileTree({
    paths: [],
    initialExpansion: 2,
    search: true,
    onSelectionChange: handleTreeSelection,
  });

  const loadFiles = useCallback(
    (fileList: FileList | File[]) => {
      try {
        const nextEntries = createWorkspaceFiles(fileList);
        workspaceLoadId.current += 1;
        requestId.current += 1;
        setLoadingPath("");
        githubRepositoryRef.current = null;
        githubFilesRef.current.clear();
        entriesRef.current = new Map(
          nextEntries.map(({ path, file }) => [path, file]),
        );
        contentsByPathRef.current.clear();
        setEntries(nextEntries);
        setContentsByPath(new Map());
        setError("");
        setCompareError("");
        setSelectedPath("");
        setView("explorer");
        setOldPath(nextEntries[0]?.path ?? "");
        setNewPath(nextEntries[1]?.path ?? nextEntries[0]?.path ?? "");
        model.resetPaths(nextEntries.map(({ path }) => path));
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : "Unable to load these files.");
      }
    },
    [model],
  );

  const loadGitHubRepository = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const loadId = ++workspaceLoadId.current;
      setGithubLoading(true);
      requestId.current += 1;
      setLoadingPath("");
      setError("");
      try {
        const parsed = parseGitHubRepository(githubInput);
        const { listPublicGitHubFiles } = await import("./lib/github");
        const result = await listPublicGitHubFiles(parsed);
        if (loadId !== workspaceLoadId.current) return;
        requestId.current += 1;
        setLoadingPath("");
        const nextEntries = result.files.map(({ path, size }) => ({
          path,
          file: new File([], path),
          size,
        }));
        githubRepositoryRef.current = result.repository;
        githubFilesRef.current = new Map(
          result.files.map((file) => [file.path, file]),
        );
        entriesRef.current = new Map(
          nextEntries.map(({ path, file }) => [path, file]),
        );
        contentsByPathRef.current.clear();
        setEntries(nextEntries);
        setContentsByPath(new Map());
        setSelectedPath("");
        setOldPath(nextEntries[0]?.path ?? "");
        setNewPath(nextEntries[1]?.path ?? nextEntries[0]?.path ?? "");
        setCompareError("");
        setView("explorer");
        setGithubFormOpen(false);
        model.resetPaths(nextEntries.map(({ path }) => path));
      } catch (cause) {
        if (loadId === workspaceLoadId.current) {
          setError(
            cause instanceof Error
              ? cause.message
              : "Unable to browse this GitHub repository.",
          );
        }
      } finally {
        if (loadId === workspaceLoadId.current) setGithubLoading(false);
      }
    },
    [githubInput, model],
  );

  const handleCompare = useCallback(async () => {
    setCompareLoading(true);
    setCompareError("");
    try {
      await Promise.all([readPath(oldPath), readPath(newPath)]);
      setView("compare");
    } catch (cause) {
      setCompareError(
        cause instanceof Error ? cause.message : "Unable to read files for comparison.",
      );
    } finally {
      setCompareLoading(false);
    }
  }, [newPath, oldPath, readPath]);

  const loadDemo = useCallback(() => loadFiles(demoFiles), [loadFiles]);

  const selectedEntry = entries.find(({ path }) => path === selectedPath);
  const selectedContents = contentsByPath.get(selectedPath);
  const githubRepository = githubRepositoryRef.current;
  const workspaceName = githubRepository
    ? `${githubRepository.owner}/${githubRepository.repo}`
    : getWorkspaceName(paths);

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Mobile Terminal Dev Tools home">
          <span className="brand-mark" aria-hidden="true">
            <Code2 size={19} strokeWidth={2} />
          </span>
          <span className="brand-copy">
            <strong>Pocket DevTools</strong>
            <small>Mobile dev tools</small>
          </span>
        </a>
        <div className="topbar-status">
          <span className={`status-dot ${entries.length ? "is-ready" : ""}`} />
          <span>{entries.length ? workspaceName : "Ready for a workspace"}</span>
        </div>
      </header>

      <section className="welcome-strip">
        <div>
          <p className="eyebrow">YOUR CODE, ON YOUR TERMS</p>
          <h1>A workspace that fits in your pocket.</h1>
          <p className="welcome-copy">
            Browse local files or a public GitHub repository, inspect code, and
            compare changes. Local files stay in this browser.
          </p>
        </div>
        <div className="import-actions">
          <button
            className="button button-primary"
            onClick={() => directoryInput.current?.click()}
          >
            <FolderOpen size={15} aria-hidden="true" /> Open a folder
          </button>
          <button
            className="button button-secondary"
            onClick={() => filesInput.current?.click()}
          >
            <Files size={15} aria-hidden="true" /> Select files
          </button>
          <input
            ref={directoryInput}
            className="visually-hidden"
            type="file"
            multiple
            onChange={(event) => {
              if (event.currentTarget.files?.length) loadFiles(event.currentTarget.files);
              event.currentTarget.value = "";
            }}
            aria-label="Choose a project folder"
          />
          <input
            ref={filesInput}
            className="visually-hidden"
            type="file"
            multiple
            onChange={(event) => {
              if (event.currentTarget.files?.length) loadFiles(event.currentTarget.files);
              event.currentTarget.value = "";
            }}
            aria-label="Choose project files"
          />
          <button
            className="button button-secondary"
            type="button"
            onClick={() => setGithubFormOpen((open) => !open)}
            aria-expanded={githubFormOpen}
            aria-controls="github-repository-form"
          >
            <GitBranch size={15} aria-hidden="true" /> GitHub repo
          </button>
          <form
            id="github-repository-form"
            className="github-import"
            onSubmit={loadGitHubRepository}
            hidden={!githubFormOpen}
          >
            <label className="visually-hidden" htmlFor="github-repository">
              Public GitHub repository
            </label>
            <input
              id="github-repository"
              autoComplete="url"
              placeholder="owner/repository"
              value={githubInput}
              onChange={(event) => setGithubInput(event.target.value)}
            />
            <button
              className="button button-primary"
              type="submit"
              disabled={!githubInput.trim() || githubLoading}
            >
              {githubLoading ? "Loading…" : "Browse"}
            </button>
            <span>Public repositories only · no token required</span>
          </form>
        </div>
      </section>

      <nav className="view-tabs" aria-label="Workspace views">
        <button
          className={view === "explorer" ? "view-tab is-active" : "view-tab"}
          onClick={() => setView("explorer")}
          aria-current={view === "explorer" ? "page" : undefined}
        >
          <Files size={14} aria-hidden="true" /> Explorer
          <span className="tab-count">{entries.length || ""}</span>
        </button>
        <button
          className={view === "compare" ? "view-tab is-active" : "view-tab"}
          onClick={() => setView("compare")}
          aria-current={view === "compare" ? "page" : undefined}
        >
          <GitCompareArrows size={14} aria-hidden="true" /> Compare
        </button>
        {entries.length === 0 && (
          <button className="demo-link" onClick={loadDemo}>
            Try a sample workspace
          </button>
        )}
      </nav>

      {error && (
        <p className="notice notice-error global-notice" role="alert">
          {error}
        </p>
      )}

      <section className="workspace">
        <Suspense
          fallback={
            <div className="empty-state">
              <span className="loading-spinner" aria-hidden="true" />
              <strong>Preparing code tools…</strong>
              <span>The viewer loads only when you need it.</span>
            </div>
          }
        >
          {view === "explorer" ? (
            <>
              <aside className="file-sidebar" aria-label="Project files">
                <div className="sidebar-heading">
                  <div>
                    <span className="eyebrow">WORKSPACE</span>
                    <strong>{workspaceName}</strong>
                  </div>
                  <span className="file-count">
                    {entries.length} {entries.length === 1 ? "file" : "files"}
                  </span>
                </div>
                {entries.length ? (
                  <FileTree model={model} className="file-tree" />
                ) : (
                  <div className="sidebar-empty">
                    <Code2 size={27} aria-hidden="true" />
                    <p>No files yet</p>
                    <small>Open a folder or try the sample workspace.</small>
                  </div>
                )}
              </aside>
              <div className="editor-area">
                {loadingPath ? (
                  <div className="empty-state">
                    <span className="loading-spinner" aria-hidden="true" />
                    <strong>
                      {githubRepository ? "Fetching" : "Reading"} {loadingPath}
                    </strong>
                    <span>File contents are read only when you open them.</span>
                  </div>
                ) : selectedEntry && selectedContents !== undefined ? (
                  <CodeViewer entry={selectedEntry} contents={selectedContents} />
                ) : selectedEntry && error ? (
                  <div className="empty-state">
                    <span className="empty-icon" aria-hidden="true">
                      !
                    </span>
                    <strong>Could not preview this file</strong>
                    <span>{error}</span>
                  </div>
                ) : (
                  <div className="empty-state">
                    <div className="empty-illustration" aria-hidden="true">
                      <Code2 size={25} />
                    </div>
                    <strong>
                      {entries.length
                        ? "Choose a file to explore"
                        : "Your workspace starts here"}
                    </strong>
                    <span>
                      {entries.length
                        ? "Select a file from the tree to read its contents."
                        : "Open a folder to browse your code, or load a sample workspace."}
                    </span>
                    {!entries.length && (
                      <button
                        className="button button-secondary"
                        onClick={loadDemo}
                      >
                        Load sample project
                      </button>
                    )}
                  </div>
                  )}
                {selectedEntry &&
                  !error &&
                  !loadingPath &&
                  selectedContents !== undefined && (
                    <button
                      className="floating-compare"
                      onClick={() => {
                        setOldPath(selectedPath);
                        setNewPath(
                          entries.find(({ path }) => path !== selectedPath)
                            ?.path ?? selectedPath,
                        );
                        setView("compare");
                      }}
                      disabled={entries.length < 2}
                    >
                      <ArrowLeftRight size={14} aria-hidden="true" />
                      <span>Compare files</span>
                    </button>
                  )}
              </div>
            </>
          ) : (
            <CompareView
              entries={entries}
              oldPath={oldPath}
              newPath={newPath}
              onOldPathChange={setOldPath}
              onNewPathChange={setNewPath}
              contentsByPath={contentsByPath}
              loading={compareLoading}
              error={compareError}
              onCompare={handleCompare}
            />
          )}
        </Suspense>
      </section>

      <footer className="privacy-footer">
        <ShieldCheck size={14} aria-hidden="true" />
        {githubRepository
          ? `Public repository · ${githubRepository.defaultBranch}`
          : "Local-first by design"}{" "}
        <i /> Local file contents are never uploaded
      </footer>
    </main>
  );
}
