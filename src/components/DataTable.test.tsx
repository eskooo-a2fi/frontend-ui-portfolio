import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { DataTable, type Person } from './DataTable';

const people: Person[] = [
  { id: 1, name: 'Zoë White', email: 'zoe@example.com', department: 'Design', status: 'Active', joined: '2025-01-01' },
  { id: 2, name: 'Ana Black', email: 'ana@example.com', department: 'Support', status: 'Invited', joined: '2025-02-01' },
];

describe('DataTable', () => {
  it('filters and sorts mock records', async () => {
    const user = userEvent.setup();
    render(<DataTable load={async () => people} />);
    expect(await screen.findByText('Ana Black')).toBeInTheDocument();
    const names = within(screen.getByRole('table')).getAllByRole('rowheader');
    expect(names[0]).toHaveTextContent('Ana Black');
    await user.click(screen.getByRole('button', { name: /name/i }));
    expect(within(screen.getByRole('table')).getAllByRole('rowheader')[0]).toHaveTextContent('Zoë White');
    await user.type(screen.getByRole('searchbox'), 'support');
    expect(screen.getByText('Ana Black')).toBeInTheDocument();
    expect(screen.queryByText('Zoë White')).not.toBeInTheDocument();
  });
});
