import { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle2, Loader2, Search, List, Table2, GitBranch, Download, FileSpreadsheet, Lightbulb } from 'lucide-react';
import TreeViewDetail from './TreeViewDetail';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { validateData } from '@/lib/mockApi';
import { LINE_LIST_COLUMNS } from '@/lib/lineListColumns';
import { cn } from '@/lib/utils';

const VIEW_COLS = LINE_LIST_COLUMNS.slice(0, 6);

// ── Sidebar ────────────────────────────────────────────────────────────────
function Sidebar({ fileInfo, onChangeFile }) {
  return (
    <div className="w-56 shrink-0 flex flex-col gap-4">
      {/* Selected Project */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="px-4 py-2.5 border-b border-border" style={{ background: 'var(--thermon-black)' }}>
          <span className="text-xs font-bold uppercase tracking-widest text-white" style={{ fontFamily: "'Oswald', sans-serif" }}>Selected Project</span>
        </div>
        <div className="p-4">
          <p className="text-xs text-muted-foreground italic">No project selected yet. You'll select a project in the next step.</p>
        </div>
      </div>

      {/* Uploaded File */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="px-4 py-2.5 border-b border-border" style={{ background: 'var(--thermon-black)' }}>
          <span className="text-xs font-bold uppercase tracking-widest text-white" style={{ fontFamily: "'Oswald', sans-serif" }}>Uploaded File</span>
        </div>
        <div className="p-4 flex flex-col gap-3">
          <div className="flex items-start gap-2">
            <FileSpreadsheet className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-medium text-foreground break-all">{fileInfo?.name || '—'}</p>
              {fileInfo?.size && <p className="text-xs text-muted-foreground mt-0.5">{(fileInfo.size / 1024).toFixed(1)} KB</p>}
            </div>
          </div>
          <Button variant="outline" size="sm" className="w-full text-xs" onClick={onChangeFile}>
            Change File
          </Button>
        </div>
      </div>

      {/* Tips */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="px-4 py-2.5 border-b border-border flex items-center gap-2" style={{ background: 'var(--thermon-black)' }}>
          <Lightbulb className="w-3.5 h-3.5 text-yellow-400" />
          <span className="text-xs font-bold uppercase tracking-widest text-white" style={{ fontFamily: "'Oswald', sans-serif" }}>Tips</span>
        </div>
        <ul className="p-4 flex flex-col gap-2">
          {[
            'Use search to quickly find specific circuits or errors',
            'Export errors to see detailed error information',
            'Try the tree view to see hierarchical organization',
          ].map((tip, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
              <span className="text-primary mt-0.5">•</span>{tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ── List View ───────────────────────────────────────────────────────────────
function ListView({ rows, result }) {
  return (
    <div className="flex flex-col divide-y divide-border border border-border rounded-lg overflow-hidden">
      {rows.map((row, i) => {
        const rowNum = i + 1;
        const rowErrors = result?.errors?.filter(e => e.row === rowNum) ?? [];
        const hasError = rowErrors.length > 0;
        return (
          <div key={i} className={cn('flex items-start gap-3 px-4 py-3', hasError && 'bg-destructive/5')}>
            <div className="mt-0.5 shrink-0">
              {hasError
                ? <AlertTriangle className="w-4 h-4 text-yellow-500" />
                : <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">{row.circuitName || `Row ${rowNum}`}</span>
                <span className="text-xs text-muted-foreground">/ {row.lineNumber}</span>
                <Badge variant={hasError ? 'destructive' : 'secondary'} className="text-xs ml-auto">{hasError ? 'Error' : 'Valid'}</Badge>
              </div>
              {hasError && (
                <ul className="mt-1 flex flex-col gap-0.5">
                  {rowErrors.map((e, j) => (
                    <li key={j} className="text-xs text-destructive">• <span className="font-medium">{e.field}</span> — {e.message}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Table View ──────────────────────────────────────────────────────────────
function TableView({ rows, result }) {
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-muted/60 border-b border-border">
              <th className="text-left px-3 py-2.5 font-semibold text-muted-foreground whitespace-nowrap">Status</th>
              {VIEW_COLS.map(c => (
                <th key={c.key} className="text-left px-3 py-2.5 font-semibold text-muted-foreground whitespace-nowrap">{c.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const rowNum = i + 1;
              const hasError = result?.errors?.some(e => e.row === rowNum);
              return (
                <tr key={i} className={cn('border-b border-border/60 hover:bg-accent/20 transition-colors', hasError && 'bg-destructive/5')}>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {hasError
                      ? <span className="flex items-center gap-1 text-yellow-600 font-medium"><AlertTriangle className="w-3.5 h-3.5" />Error</span>
                      : <span className="flex items-center gap-1 text-emerald-600 font-medium"><CheckCircle2 className="w-3.5 h-3.5" />Valid</span>}
                  </td>
                  {VIEW_COLS.map(c => (
                    <td key={c.key} className="px-3 py-2 text-foreground whitespace-nowrap max-w-[120px] truncate">
                      {row[c.key] ?? <span className="text-muted-foreground/40">—</span>}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────
export default function Step3Validate({ rows, fileInfo, onNext, onBack }) {
  const [status, setStatus] = useState('loading');
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState('errors');
  const [viewMode, setViewMode] = useState('table');
  const [search, setSearch] = useState('');

  useEffect(() => {
    validateData(rows).then(res => { setResult(res); setStatus('done'); });
  }, []);

  const errorRows = result ? rows.filter((_, i) => result.errors.some(e => e.row === i + 1)) : [];
  const validRows = result ? rows.filter((_, i) => !result.errors.some(e => e.row === i + 1)) : [];

  const displayRows = (() => {
    const base = activeTab === 'errors' ? errorRows : activeTab === 'valid' ? validRows : rows;
    if (!search.trim()) return base;
    const q = search.toLowerCase();
    return base.filter(r =>
      Object.values(r).some(v => String(v ?? '').toLowerCase().includes(q))
    );
  })();

  const exportErrors = () => {
    if (!result) return;
    const csv = ['Row,Field,Message', ...result.errors.map(e => `${e.row},"${e.field}","${e.message}"`)].join('\n');
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = 'validation_errors.csv'; a.click();
  };

  const TABS = [
    { id: 'errors', label: 'Errors', count: result?.errors?.length ?? 0 },
    { id: 'all', label: 'All Circuits', count: rows.length },
    { id: 'valid', label: 'Valid Circuits', count: validRows.length },
  ];

  const VIEWS = [
    { id: 'list', icon: List, label: 'List View' },
    { id: 'table', icon: Table2, label: 'Table View' },
    { id: 'tree', icon: GitBranch, label: 'Tree View' },
  ];

  return (
    <div className="flex gap-6 w-full">
      {/* Sidebar */}
      <Sidebar fileInfo={fileInfo} onChangeFile={onBack} />

      {/* Main */}
      <div className="flex-1 flex flex-col gap-4 min-w-0">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Validate Data</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Checking {rows.length} rows against field rules and lookup values.</p>
        </div>

        {status === 'loading' && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {status === 'done' && result && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-4 rounded-lg border-l-4 border-l-emerald-500 border border-border bg-card">
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{validRows.length}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Valid Circuits</p>
              </div>
              <div className="p-4 rounded-lg border-l-4 border-l-destructive border border-border bg-card">
                <p className="text-2xl font-bold text-destructive">{errorRows.length}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Circuits with Errors</p>
              </div>
              <div className="p-4 rounded-lg border-l-4 border-l-yellow-500 border border-border bg-card">
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{result.warnings?.length ?? 0}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Fields to Review</p>
              </div>
            </div>

            {/* Error banner */}
            {errorRows.length > 0 && (
              <div className="flex items-start gap-3 px-4 py-3 rounded-lg border border-destructive/40 bg-destructive/5">
                <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-destructive uppercase tracking-wide">{errorRows.length} Circuits Have Validation Errors</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Please review and fix the errors below before submitting. Common issues: Invalid segment pipe dimensions, missing required fields.</p>
                </div>
              </div>
            )}

            {/* Tabs */}
            <div className="flex items-center gap-0 border-b border-border">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px',
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  )}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <Badge className={cn('text-xs', activeTab === tab.id && tab.id === 'errors' ? 'bg-destructive text-white' : 'bg-muted text-muted-foreground')}>
                      {tab.count}
                    </Badge>
                  )}
                </button>
              ))}
            </div>

            {/* View toggles */}
            <div className="flex items-center gap-2">
              {VIEWS.map(v => (
                <button
                  key={v.id}
                  onClick={() => setViewMode(v.id)}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-xs font-medium transition-colors',
                    viewMode === v.id ? 'border-primary bg-primary/5 text-primary' : 'border-border text-muted-foreground hover:text-foreground'
                  )}
                >
                  <v.icon className="w-3.5 h-3.5" />{v.label}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search circuits, connections, or errors…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Data view */}
            <div className="min-h-[200px]">
              {viewMode === 'list' && <ListView rows={displayRows} result={result} />}
              {viewMode === 'table' && <TableView rows={displayRows} result={result} />}
              {viewMode === 'tree' && <TreeViewDetail rows={rows} result={result} fileInfo={fileInfo} />}
              {displayRows.length === 0 && (
                <div className="flex items-center justify-center py-10 text-sm text-muted-foreground">No records to display.</div>
              )}
            </div>
          </>
        )}

        {/* Nav */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex gap-2">
            <Button variant="outline" onClick={onBack}>← Back</Button>
            {status === 'done' && result?.errors?.length > 0 && (
              <Button variant="outline" onClick={exportErrors} className="gap-2">
                <Download className="w-3.5 h-3.5" /> Export Errors
              </Button>
            )}
          </div>
          <Button onClick={onNext} disabled={status !== 'done'}>
            Continue to Review →
          </Button>
        </div>
      </div>
    </div>
  );
}