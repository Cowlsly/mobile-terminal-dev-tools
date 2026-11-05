import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import App from "./App";

afterEach(cleanup);

describe("workspace shell", () => {
  it("offers local files, a demo, and a public repository without asking for a token", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(
      screen.getByRole("button", { name: /open a folder/i }),
    ).toBeTruthy();
    expect(
      within(screen.getByRole("navigation", { name: /workspace views/i })).getByRole(
        "button",
        { name: /try a sample workspace/i },
      ),
    ).toBeTruthy();

    await user.click(screen.getByRole("button", { name: /github repo/i }));
    expect(
      screen.getByRole("textbox", { name: /public github repository/i }),
    ).toBeTruthy();
    expect(
      screen.getByText(/public repositories only · no token required/i),
    ).toBeTruthy();
  });

  it("rejects a non-GitHub host before making a repository request", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /github repo/i }));
    await user.type(
      screen.getByRole("textbox", { name: /public github repository/i }),
      "https://example.com/owner/repo",
    );
    await user.click(screen.getByRole("button", { name: "Browse" }));

    const alert = await screen.findByRole("alert");
    expect(alert.textContent).toContain(
      "Only HTTPS URLs from github.com are supported.",
    );
  });

  it("loads the sample workspace and opens the compare view", async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);

    await user.click(screen.getByRole("button", { name: /load sample project/i }));
    expect(screen.getByText("3 files")).toBeTruthy();

    const firstFile = container
      .querySelector(".file-tree")
      ?.shadowRoot?.querySelector<HTMLElement>(
        '[data-type="item"][data-item-type="file"]',
      );
    expect(firstFile).toBeTruthy();
    await user.click(firstFile!);
    expect(await screen.findByText("src/greeting-updated.ts")).toBeTruthy();
    expect(container.querySelector(".highlighted-code")?.textContent).toContain(
      "Welcome back",
    );

    await user.click(
      within(screen.getByRole("navigation", { name: /workspace views/i })).getByRole(
        "button",
        { name: /compare/i },
      ),
    );
    expect(
      await screen.findByRole("region", { name: /compare files/i }),
    ).toBeTruthy();
    expect(await screen.findByText("Choose two files")).toBeTruthy();
  });

  it("reads selected local files and mounts the diff renderer", async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);

    await user.click(screen.getByRole("button", { name: /load sample project/i }));
    await user.click(
      within(screen.getByRole("navigation", { name: /workspace views/i })).getByRole(
        "button",
        { name: /compare/i },
      ),
    );
    const compareRegion = await screen.findByRole("region", {
      name: /compare files/i,
    });
    await user.selectOptions(
      within(compareRegion).getByLabelText("Original"),
      "src/greeting.ts",
    );
    await user.selectOptions(
      within(compareRegion).getByLabelText("Compare with"),
      "src/greeting-updated.ts",
    );
    await user.click(
      within(compareRegion).getByRole("button", { name: "Compare" }),
    );

    await waitFor(() => {
      expect(container.querySelector(".diff-container")?.childElementCount).toBeGreaterThan(0);
    });
  });

  it("uses a hidden directory picker as the local folder source", () => {
    render(<App />);
    const directoryInput = screen.getByLabelText("Choose a project folder");
    expect(directoryInput.hasAttribute("webkitdirectory")).toBe(true);
    expect(directoryInput.hasAttribute("multiple")).toBe(true);
    fireEvent.change(directoryInput, {
      target: { files: [new File(["export const ok = true"], "src/main.ts")] },
    });
    expect(screen.getByText("1 file")).toBeTruthy();
  });
});
