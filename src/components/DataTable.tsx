import { useEffect, useId, useMemo, useState } from 'react';
import { AlertCircle, ArrowDown, ArrowDownUp, ArrowUp, ChevronLeft, ChevronRight, Search, SlidersHorizontal } from 'lucide-react';

export type Person = {
  id: number;
  name: string;
  email: string;
  department: string;
  status: 'Active' | 'Invited' | 'Inactive';
  joined: string;
};
type SortKey = keyof Pick<Person, 'name' | 'email' | 'department' | 'status' | 'joined'>;
type SortDirection = 'asc' | 'desc';
const PAGE_SIZE = 6;

/** Fetching a static JSON resource models the async loading/error lifecycle of a real API. */
export async function getPeople(signal?: AbortSignal): Promise<Person[]> {
  const response = await fetch(`${import.meta.env.BASE_URL}mock-users.json`, { signal });
  if (!response.ok) throw new Error(`Unable to load records (${response.status})`);
  return (await response.json()) as Person[];
}

export function DataTable({ load = getPeople }: { load?: (signal?: AbortSignal) => Promise<Person[]> }) {
  const id = useId();
  const [rows, setRows] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<{ key: SortKey; direction: SortDirection }>({ key: 'name', direction: 'asc' });
  const [page, setPage] = useState(1);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');
    load(controller.signal).then(data => { if (!controller.signal.aborted) setRows(data); }).catch(e => {
      if (!controller.signal.aborted) setError(e instanceof Error ? e.message : 'Unable to load records.');
    }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [load, reload]);

  const filtered = useMemo(() => {
    const needle = search.trim().toLocaleLowerCase();
    return rows.filter(row => !needle || [row.name, row.email, row.department, row.status].some(value => value.toLocaleLowerCase().includes(needle)))
      .sort((a, b) => {
        const cmp = a[sort.key].localeCompare(b[sort.key], undefined, { sensitivity: 'base' });
        return sort.direction === 'asc' ? cmp : -cmp;
      });
  }, [rows, search, sort]);
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pages);
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const rangeStart = filtered.length ? (currentPage - 1) * PAGE_SIZE + 1 : 0;
  const rangeEnd = Math.min(currentPage * PAGE_SIZE, filtered.length);

  const sortBy = (key: SortKey) => {
    setSort(old => ({ key, direction: old.key === key && old.direction === 'asc' ? 'desc' : 'asc' }));
    setPage(1);
  };
  const columns: { key: SortKey; label: string }[] = [
    { key: 'name', label: 'Name' }, { key: 'email', label: 'Email' },
    { key: 'department', label: 'Department' }, { key: 'status', label: 'Status' }, { key: 'joined', label: 'Joined' },
  ];
  return (
    <section aria-label="Team directory" className="overflow-hidden rounded-[24px] border border-slate-700/70 bg-[#111b30] shadow-2xl shadow-indigo-950/10">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 p-5 sm:p-7">
        <div><p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-indigo-300">People management</p><h2 className="text-xl font-semibold text-white">Team directory</h2><p className="mt-1 text-sm text-slate-400">Find and manage your workspace members.</p></div>
        <div className="flex items-center gap-2 text-sm text-slate-400"><SlidersHorizontal size={17} aria-hidden="true" /> {rows.length} total</div>
      </div>
      <div className="p-5 pb-4 sm:p-7 sm:pb-5">
        <label htmlFor={`${id}-search`} className="mb-2 block text-sm font-medium text-slate-300">Search directory</label>
        <div className="relative max-w-md"><Search aria-hidden="true" size={18} className="absolute left-3.5 top-3.5 text-slate-500" />
          <input id={`${id}-search`} type="search" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search name, email, department…" className="w-full rounded-xl border border-slate-700 bg-slate-900/80 py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/20" /></div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <caption className="sr-only">People directory. Click a column header to sort.</caption>
          <thead className="bg-white/3"><tr>{columns.map(({ key, label }) => (
            <th key={key} scope="col" aria-sort={sort.key === key ? (sort.direction === 'asc' ? 'ascending' : 'descending') : 'none'} className="px-5 py-4 font-medium text-slate-400 first:pl-7 last:pr-7">
              <button type="button" onClick={() => sortBy(key)} className="inline-flex items-center gap-2 text-left hover:text-white">{label}
                {sort.key === key ? (sort.direction === 'asc' ? <ArrowUp size={14} aria-hidden="true" /> : <ArrowDown size={14} aria-hidden="true" />) : <ArrowDownUp size={14} aria-hidden="true" />}
              </button>
            </th>
          ))}</tr></thead>
          <tbody>{!loading && !error && visible.map(row => <tr key={row.id} className="border-t border-white/6 hover:bg-white/3">
            <th scope="row" className="whitespace-nowrap px-5 py-4 font-medium text-white first:pl-7">{row.name}</th>
            <td className="px-5 py-4 text-slate-400">{row.email}</td><td className="px-5 py-4 text-slate-300">{row.department}</td>
            <td className="px-5 py-4"><span className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-medium ${row.status === 'Active' ? 'bg-emerald-500/10 text-emerald-300' : row.status === 'Invited' ? 'bg-amber-500/10 text-amber-300' : 'bg-slate-500/15 text-slate-300'}`}><span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current" />{row.status}</span></td>
            <td className="whitespace-nowrap px-5 py-4 text-slate-400 last:pr-7">{new Date(`${row.joined}T00:00:00Z`).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' })}</td>
          </tr>)}</tbody>
        </table>
        {loading && <p role="status" className="px-7 py-12 text-center text-sm text-slate-400">Loading directory…</p>}
        {error && <div role="alert" className="flex flex-col items-center gap-3 px-7 py-12 text-center text-sm text-rose-300"><AlertCircle aria-hidden="true" />{error}<button type="button" className="rounded-lg border border-slate-600 px-3 py-2 text-white" onClick={() => setReload(i => i + 1)}>Retry</button></div>}
        {!loading && !error && visible.length === 0 && <p role="status" className="px-7 py-12 text-center text-sm text-slate-400">No people match your search.</p>}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 px-5 py-5 text-xs text-slate-400 sm:px-7">
        <span aria-live="polite">Showing {rangeStart}–{rangeEnd} of {filtered.length} records</span>
        <div className="flex items-center gap-3"><span>Page {currentPage} of {pages}</span>
          <button type="button" aria-label="Previous page" disabled={currentPage === 1 || loading} onClick={() => setPage(p => Math.max(1, p - 1))} className="rounded-lg border border-slate-700 p-2 text-white hover:bg-white/5 disabled:opacity-35"><ChevronLeft size={18} /></button>
          <button type="button" aria-label="Next page" disabled={currentPage >= pages || loading} onClick={() => setPage(p => Math.min(pages, p + 1))} className="rounded-lg border border-slate-700 p-2 text-white hover:bg-white/5 disabled:opacity-35"><ChevronRight size={18} /></button>
        </div>
      </div>
    </section>
  );
}
