import { useEffect, useRef, useState } from 'react';
import { BarChart3, Bell, ChevronLeft, ChevronRight, CircleHelp, FolderKanban, LayoutDashboard, LogOut, Menu, Settings2, X } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type NavItem = { label: string; icon: LucideIcon; id: string };
const primary: NavItem[] = [
  { id: 'Overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'Analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'Projects', label: 'Projects', icon: FolderKanban },
  { id: 'Notifications', label: 'Notifications', icon: Bell },
];
const secondary: NavItem[] = [
  { id: 'Settings', label: 'Settings', icon: Settings2 },
  { id: 'Help', label: 'Help & support', icon: CircleHelp },
];
export type DashboardSidebarProps = { active: string; onNavigate: (id: string) => void };

export function DashboardSidebar({ active, onNavigate }: DashboardSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeButton = useRef<HTMLButtonElement>(null);
  const mobileTrigger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setMobileOpen(false); mobileTrigger.current?.focus(); }
    };
    document.addEventListener('keydown', onKeyDown);
    closeButton.current?.focus();
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [mobileOpen]);

  const navList = (items: NavItem[], label: string) => (
    <nav aria-label={label} className="space-y-1">
      {items.map(({ id, icon: Icon, label: name }) => (
        <button key={id} type="button" onClick={() => { onNavigate(id); setMobileOpen(false); }} title={collapsed ? name : undefined}
          aria-current={active === id ? 'page' : undefined}
          className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition ${active === id ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
          <Icon aria-hidden="true" size={19} className="shrink-0" />
          <span className={`${collapsed ? 'lg:sr-only' : ''} truncate`}>{name}</span>
          {id === 'Notifications' && !collapsed && <span className="ml-auto rounded-md bg-indigo-400/20 px-1.5 text-[11px] text-indigo-200">3</span>}
        </button>
      ))}
    </nav>
  );

  return (
    <>
      <button ref={mobileTrigger} type="button" onClick={() => setMobileOpen(true)} aria-controls="portfolio-sidebar" aria-expanded={mobileOpen} aria-label="Open navigation" className="fixed left-4 top-4 z-30 rounded-xl border border-slate-700 bg-slate-900 p-3 text-white shadow-lg lg:hidden"><Menu size={20} aria-hidden="true" /></button>
      {mobileOpen && <button type="button" aria-label="Close navigation overlay" tabIndex={-1} onClick={() => setMobileOpen(false)} className="fixed inset-0 z-40 bg-slate-950/75 lg:hidden" />}
      <aside id="portfolio-sidebar" aria-label="Workspace sidebar" className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-white/7 bg-[#101829] p-4 transition-all duration-200 lg:sticky lg:top-0 lg:h-screen ${collapsed ? 'lg:w-[92px]' : 'lg:w-64'} ${mobileOpen ? 'w-72 translate-x-0' : 'w-72 -translate-x-full lg:translate-x-0'}`}>
        <div className="mb-10 flex items-center gap-3 px-2 pt-2">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500 text-lg font-bold text-white">S</div>
          <div className={`${collapsed ? 'lg:sr-only' : ''}`}><p className="font-semibold tracking-tight text-white">Studio HQ</p><p className="text-xs text-slate-500">Workspace</p></div>
          <button ref={closeButton} type="button" onClick={() => { setMobileOpen(false); mobileTrigger.current?.focus(); }} aria-label="Close navigation" className="ml-auto rounded-lg p-2 text-slate-400 hover:bg-white/10 lg:hidden"><X size={19} /></button>
        </div>
        <div className="mb-6 px-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-600">{!collapsed ? 'Workspace' : <span className="sr-only">Workspace</span>}</div>
        {navList(primary, 'Main navigation')}
        <div className="mt-8 mb-5 border-t border-white/8" />
        {navList(secondary, 'Account navigation')}
        <div className="mt-auto space-y-4">
          <button type="button" onClick={() => setCollapsed(c => !c)} aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} aria-expanded={!collapsed} className="hidden w-full items-center justify-center gap-2 rounded-xl border border-slate-700/70 px-2 py-2 text-xs text-slate-300 hover:bg-white/5 lg:flex">{collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}{!collapsed && 'Collapse menu'}</button>
          <div className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/3 p-2.5">
            <div aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-400 to-indigo-600 text-sm font-bold text-white">JD</div>
            <div className={`${collapsed ? 'lg:sr-only' : ''} min-w-0 flex-1`}><p className="truncate text-xs font-semibold text-white">Jordan Davis</p><p className="truncate text-[11px] text-slate-500">Demo profile</p></div>
            <LogOut aria-hidden="true" size={16} className={`${collapsed ? 'lg:hidden' : ''} text-slate-600`} />
          </div>
        </div>
      </aside>
    </>
  );
}
