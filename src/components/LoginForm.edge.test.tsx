import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { LoginForm } from './LoginForm';

describe('login submission errors', () => {
  it('announces submission failure without exposing implementation details', async () => {
    const user = userEvent.setup();
    const submit = vi.fn().mockRejectedValue(new Error('internal diagnostic / stack trace'));
    render(<LoginForm onSubmit={submit} />);

    await user.type(screen.getByLabelText('Email address'), 'someone@example.com');
    await user.type(screen.getByLabelText('Password'), 'password-12345');
    await user.click(screen.getByRole('button', { name: 'Sign in' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Please try again');
    expect(screen.queryByText(/internal diagnostic/i)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeEnabled();
  });
});
