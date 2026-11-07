import { cleanup, fireEvent, render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, it, vi } from 'vitest';
const api = vi.hoisted(() => ({listPublicGitHubFiles: vi.fn()}));
vi.mock('./lib/github', () => api);
import App from './App';
afterEach(cleanup);

it('allows a new GitHub request after local import supersedes a pending request', async () => {
  let finish!: (value: unknown) => void;
  api.listPublicGitHubFiles.mockReturnValue(new Promise(resolve => { finish = resolve; }));
  const user = userEvent.setup();
  render(<App />);
  await user.click(screen.getByRole('button', {name: /github repo/i}));
  await user.type(screen.getByRole('textbox', {name: /public github repository/i}), 'owner/repo');
  await user.click(screen.getByRole('button', {name: 'Browse'}));
  await waitFor(() => expect(api.listPublicGitHubFiles).toHaveBeenCalled());
  fireEvent.change(screen.getByLabelText('Choose project files'), {target: {files: [new File(['local'], 'local.txt')]}});
  expect((screen.getByRole('button', {name: 'Browse'}) as HTMLButtonElement).disabled).toBe(false);
  await act(async () => finish({repository: {owner:'owner',repo:'repo',defaultBranch:'root'},files: []}));
  expect(screen.getByText('1 file')).toBeTruthy();
});

it('ignores comparison completion after the workspace changes', async () => {
  let finish!: (value: ArrayBuffer) => void;
  const file = new File(['old'], 'old.txt');
  Object.defineProperty(file, 'arrayBuffer', {value: () => new Promise<ArrayBuffer>(resolve => { finish = resolve; })});
  const user = userEvent.setup();
  render(<App />);
  fireEvent.change(screen.getByLabelText('Choose project files'), {target: {files: [file]}});
  await user.click(screen.getByRole('button', {name: /^Compare$/}));
  const region = await screen.findByRole('region', {name: 'Compare files'});
  fireEvent.click(region.querySelector('button')!);
  await waitFor(() => expect(finish).toBeTypeOf('function'));
  fireEvent.change(screen.getByLabelText('Choose project files'), {target: {files: [new File(['new'], 'new.txt')]}});
  await act(async () => finish(new TextEncoder().encode('old').buffer));
  expect(screen.queryByRole('region', {name:'Compare files'})).toBeNull();
  expect(screen.queryByRole('alert')).toBeNull();
});
