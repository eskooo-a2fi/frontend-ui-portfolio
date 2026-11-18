import { useId, useState, type FormEvent } from 'react';
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck } from 'lucide-react';

type Errors = Partial<Record<'email' | 'password', string>>;
export type LoginCredentials = { email: string; password: string; remember: boolean };
export type LoginFormProps = { onSubmit?: (credentials: LoginCredentials) => Promise<void> | void };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginForm({ onSubmit }: LoginFormProps) {
  const formId = useId();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [visible, setVisible] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });
  const [submitted, setSubmitted] = useState(false);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [submitFailed, setSubmitFailed] = useState(false);

  const validate = (): Errors => {
    const next: Errors = {};
    if (!email.trim()) next.email = 'Email address is required.';
    else if (!EMAIL_PATTERN.test(email.trim())) next.email = 'Enter a valid email address.';
    if (!password) next.password = 'Password is required.';
    else if (password.length < 8) next.password = 'Use at least 8 characters.';
    return next;
  };

  const inputStyle = 'w-full rounded-xl border border-slate-700 bg-slate-900/90 py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-slate-500 transition focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/20';
  const fieldErrors = submitted ? validate() : {
    email: touched.email ? validate().email : undefined,
    password: touched.password ? validate().password : undefined,
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    const next = validate();
    setMessage(null);
    setSubmitFailed(false);
    if (Object.keys(next).length) return;
    setPending(true);
    try {
      await onSubmit?.({ email: email.trim(), password, remember });
      setMessage('Validation passed. This is a demo; no account was accessed.');
    } catch {
      setSubmitFailed(true);
      setMessage('Sign-in could not be completed. Please try again.');
    } finally {
      setPending(false);
    }
  };

  return (
    <section aria-labelledby={`${formId}-title`} className="mx-auto w-full max-w-md rounded-[28px] border border-slate-700/70 bg-[#111b30] p-6 shadow-2xl shadow-indigo-950/20 sm:p-9">
      <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/15 text-indigo-300"><LockKeyhole aria-hidden="true" size={24} /></div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-300">Sign-in component demo</p>
      <h2 id={`${formId}-title`} className="text-2xl font-semibold tracking-tight text-white">Welcome back</h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-400">Validation and error states in a local UI example.</p>

      <form noValidate onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label htmlFor={`${formId}-email`} className="mb-2 block text-sm font-medium text-slate-200">Email address</label>
          <div className="relative"><Mail aria-hidden="true" size={18} className="pointer-events-none absolute left-4 top-3.5 text-slate-500" />
            <input id={`${formId}-email`} type="email" autoComplete="email" value={email} placeholder="you@company.com" className={inputStyle} aria-invalid={Boolean(fieldErrors.email)} aria-describedby={fieldErrors.email ? `${formId}-email-error` : undefined} onBlur={() => setTouched(t => ({ ...t, email: true }))} onChange={e => { setEmail(e.target.value); setMessage(null); }} />
          </div>
          {fieldErrors.email && <p id={`${formId}-email-error`} role="alert" className="mt-2 text-xs text-rose-300">{fieldErrors.email}</p>}
        </div>
        <div>
          <label htmlFor={`${formId}-password`} className="mb-2 block text-sm font-medium text-slate-200">Password</label>
          <div className="relative"><LockKeyhole aria-hidden="true" size={18} className="pointer-events-none absolute left-4 top-3.5 text-slate-500" />
            <input id={`${formId}-password`} type={visible ? 'text' : 'password'} autoComplete="current-password" value={password} placeholder="At least 8 characters" className={`${inputStyle} pr-12`} aria-invalid={Boolean(fieldErrors.password)} aria-describedby={fieldErrors.password ? `${formId}-password-error` : undefined} onBlur={() => setTouched(t => ({ ...t, password: true }))} onChange={e => { setPassword(e.target.value); setMessage(null); }} />
            <button type="button" className="absolute right-3 top-3 rounded-lg p-1 text-slate-400 hover:text-white" aria-label={visible ? 'Hide password' : 'Show password'} aria-pressed={visible} onClick={() => setVisible(v => !v)}>{visible ? <EyeOff aria-hidden="true" size={19} /> : <Eye aria-hidden="true" size={19} />}</button>
          </div>
          {fieldErrors.password && <p id={`${formId}-password-error`} role="alert" className="mt-2 text-xs text-rose-300">{fieldErrors.password}</p>}
        </div>
        <label className="flex cursor-pointer items-center gap-3 text-sm text-slate-300">
          <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} className="h-4 w-4 accent-indigo-500" /> Remember me
        </label>
        <button type="submit" disabled={pending} className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-500 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:opacity-60">{pending ? 'Checking…' : 'Sign in'} <ArrowRight aria-hidden="true" size={18} /></button>
        {message && <p role={submitFailed ? "alert" : "status"} aria-live="polite" className="rounded-xl border border-indigo-400/20 bg-indigo-400/10 p-3 text-sm text-indigo-100">{message}</p>}
      </form>
      <div className="mt-7 flex items-center gap-2 border-t border-slate-800 pt-5 text-xs text-slate-500"><ShieldCheck size={16} aria-hidden="true" /> Accessible validation · local UI demonstration</div>
    </section>
  );
}
