import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { LoginForm } from './LoginForm';

describe('LoginForm', () => {
  it('shows accessible errors for invalid input', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);
    await user.click(screen.getByRole('button', { name: /sign in/i }));
    expect(screen.getByText('Email address is required.')).toBeInTheDocument();
    expect(screen.getByText('Password is required.')).toBeInTheDocument();
    await user.type(screen.getByLabelText('Email address'), 'not-an-email');
    await user.type(screen.getByLabelText('Password'), 'short');
    await user.click(screen.getByRole('button', { name: /sign in/i }));
    expect(screen.getByText('Enter a valid email address.')).toBeInTheDocument();
    expect(screen.getByText('Use at least 8 characters.')).toBeInTheDocument();
  });

  it('submits valid credentials and remember-me preference', async () => {
    const user = userEvent.setup();
    const submit = vi.fn();
    render(<LoginForm onSubmit={submit} />);
    await user.type(screen.getByLabelText('Email address'), 'test@example.com');
    await user.type(screen.getByLabelText('Password'), 'strong-pass-123');
    await user.click(screen.getByRole('checkbox', { name: 'Remember me' }));
    await user.click(screen.getByRole('button', { name: /sign in/i }));
    expect(submit).toHaveBeenCalledWith({ email: 'test@example.com', password: 'strong-pass-123', remember: true });
  });
});
