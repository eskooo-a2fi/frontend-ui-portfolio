import { useState } from 'react';
import { ArrowUpRight, Code2, Command, DatabaseZap, Fingerprint, Layers3 } from 'lucide-react';
import { LoginForm } from './components/LoginForm';
import { DashboardSidebar } from './components/DashboardSidebar';
import { DataTable } from './components/DataTable';

const features = [
  { title: 'Login form', subtitle: 'Validation · form state · accessibility', icon: Fingerprint },
  { title: 'Sidebar navigation', subtitle: 'Responsive · collapsible · semantic', icon: Layers3 },
  { title: 'Data table', subtitle: 'Async data · sorting · filtering', icon: DatabaseZap },
];

export default function App() {
  const [active, setActive] = useState('Overview');
  const [tab, setTab] = useState<'Login' | 'Table'>('Table');
  return (
    <div className="min-h-screen bg-[#080e1b] text-slate-100 lg:flex">
      <DashboardSidebar active={active} onNavigate={id => { setActive(id); if (id === 'Projects') setTab('Login'); else if (id === 'Analytics') setTab('Table'); }} />
      <main className="min-w-0 flex-1 px-5 pb-20 pt-24 sm:px-9 lg:pt-9 xl:px-14">
        <header className="mx-auto mb-9 flex max-w-6xl flex-wrap items-center justify-between gap-4">
          <div><div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-indigo-300"><Command size={15} aria-hidden="true" /> Frontend engineering portfolio</div><h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Component studio<span className="text-indigo-400">.</span></h1><p className="mt-2 text-sm text-slate-400">Production-minded React + TypeScript components, built for the details.</p></div>
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/7 px-4 py-2 text-xs font-medium text-emerald-300"><span aria-hidden="true" className="h-2 w-2 rounded-full bg-emerald-400" /> UI demo ready</span>
        </header>
        <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-3">{features.map(({ title, subtitle, icon: Icon }, i) => <div key={title} className="rounded-2xl border border-slate-800 bg-[#111b30] p-5"><div className="mb-5 flex items-center justify-between"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-400/10 text-indigo-300"><Icon size={20} aria-hidden="true" /></span><span className="text-xs text-slate-600">0{i + 1} / 03</span></div><p className="text-base font-semibold text-white">{title}</p><p className="mt-1 text-xs text-slate-500">{subtitle}</p></div>)}</div>
        <section aria-labelledby="preview-title" className="mx-auto mt-8 max-w-6xl">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">Interactive preview</p><h2 id="preview-title" className="mt-1 text-xl font-semibold text-white">See the components in action</h2></div><div role="group" aria-label="Choose preview" className="flex rounded-xl border border-slate-700 bg-[#111b30] p-1"><button type="button" aria-pressed={tab === 'Table'} onClick={() => setTab('Table')} className={`rounded-lg px-4 py-2 text-sm ${tab === 'Table' ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:text-white'}`}>Data table</button><button type="button" aria-pressed={tab === 'Login'} onClick={() => setTab('Login')} className={`rounded-lg px-4 py-2 text-sm ${tab === 'Login' ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:text-white'}`}>Login form</button></div></div>
          {tab === 'Table' ? <DataTable /> : <div className="rounded-[24px] border border-slate-800 bg-[radial-gradient(ellipse_at_top,_#1b2750_0%,_#0a1020_65%)] px-3 py-10 sm:p-12"><LoginForm /></div>}
        </section>
        <footer className="mx-auto mt-12 flex max-w-6xl flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-6 text-xs text-slate-500"><span className="inline-flex items-center gap-2"><Code2 size={15} aria-hidden="true" /> Built with React, TypeScript, Tailwind CSS and Vitest</span><span className="inline-flex items-center gap-1">Portfolio demo <ArrowUpRight size={14} aria-hidden="true" /></span></footer>
      </main>
    </div>
  );
}
