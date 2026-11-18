import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { DataTable, getPeople, type Person } from './DataTable';

const customers: Person[] = [
  { id: 1, name: 'Amina Cole', email: 'amina@example.com', department: 'Design', status: 'Active', joined: '2026-01-14' },
  { id: 2, name: 'Ben Shaw', email: 'ben@example.com', department: 'Support', status: 'Invited', joined: '2026-02-14' },
];

afterEach(() => vi.unstubAllGlobals());

describe('directory failure states', () => {
  it('rejects an unexpected response shape before rendering it', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ results: customers }),
    }));

    await expect(getPeople()).rejects.toThrow('invalid data');
  });

  it('handles a corrupt JSON response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => { throw new SyntaxError('Unexpected internal parse details'); },
    }));
    await expect(getPeople()).rejects.toThrow('invalid data');
  });

  it('reports an HTTP failure without exposing the response body', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 503 }));
    await expect(getPeople()).rejects.toThrow('temporarily unavailable');
  });

  it('rejects duplicate identifiers', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [customers[0], { ...customers[0], name: 'Another person' }],
    }));

    await expect(getPeople()).rejects.toThrow('duplicate record IDs');
  });

  it('shows a recoverable error and reloads on retry', async () => {
    let attempts = 0;
    const load = vi.fn(async () => {
      attempts++;
      if (attempts === 1) throw new Error('Connection failed');
      return customers;
    });
    const user = userEvent.setup();
    render(<DataTable load={load} />);

    expect(await screen.findByRole('alert')).toHaveTextContent('Unable to load the directory');
    await user.click(screen.getByRole('button', { name: 'Retry' }));
    expect(await screen.findByText('Amina Cole')).toBeInTheDocument();
    expect(load).toHaveBeenCalledTimes(2);
  });

  it('handles an empty response without dividing by zero', async () => {
    render(<DataTable load={async () => []} />);
    expect(await screen.findByText('No people match your search.')).toBeInTheDocument();
    expect(screen.getByText('Page 1 of 1')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
  });
});
