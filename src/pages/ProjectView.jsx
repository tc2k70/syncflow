import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Database, Loader2, RefreshCw, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { fetchProjectData } from '@/lib/mockApi';
import ThemeToggle from '../components/ThemeToggle';

const STATUS_STYLES = {
  Active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400',
  Review: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-400',
};

export default function ProjectView() {
  const { projectId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const load = () => {
    setLoading(true);
    fetchProjectData(projectId).then(d => { setData(d); setLoading(false); });
  };

  useEffect(() => { load(); }, [projectId]);

  const filtered = data?.circuits?.filter(c =>
    c.circuitName.toLowerCase().includes(search.toLowerCase()) ||
    c.lineNumber.toLowerCase().includes(search.toLowerCase()) ||
    c.heaterFamily.toLowerCase().includes(search.toLowerCase())
  ) ?? [];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="px-6 py-3 flex items-center justify-between sticky top-0 z-10" style={{ background: 'var(--thermon-black)', borderBottom: '3px solid var(--thermon-red)' }}>
        <div className="flex items-center gap-3">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-1.5 text-white/70 hover:text-white hover:bg-white/10">
              <ArrowLeft className="w-4 h-4" /> Back to Import
            </Button>
          </Link>
          <div className="w-px h-5 bg-white/20" />
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-white/60" />
            <span className="text-sm font-bold text-white tracking-widest uppercase" style={{ fontFamily: "'Oswald', sans-serif" }}>Project {projectId}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5 border-white/20 text-white/80 hover:bg-white/10" onClick={load}>
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </Button>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 px-6 py-8 max-w-6xl mx-auto w-full flex flex-col gap-6">
        {/* Page title */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Merged Project Data</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Showing all heat tracing circuits after import merge for project <span className="font-medium text-foreground">{projectId}</span>.
            </p>
          </div>
          {data && (
            <Badge variant="secondary" className="shrink-0 mt-1">{data.circuits.length} circuits</Badge>
          )}
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center py-24">
            <div className="flex flex-col items-center gap-3 text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm">Loading project data…</p>
            </div>
          </div>
        ) : (
          <>
            {/* Stats row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Total Circuits', value: data.circuits.length, icon: Zap },
                { label: 'Active', value: data.circuits.filter(c => c.status === 'Active').length, color: 'text-emerald-600 dark:text-emerald-400' },
                { label: 'In Review', value: data.circuits.filter(c => c.status === 'Review').length, color: 'text-yellow-600 dark:text-yellow-400' },
                { label: 'Unique Families', value: [...new Set(data.circuits.map(c => c.heaterFamily))].length },
              ].map((stat, i) => (
                <div key={i} className="p-4 rounded-lg border border-border bg-card">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">{stat.label}</p>
                  <p className={`text-2xl font-semibold mt-1 ${stat.color || 'text-foreground'}`}>{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Search */}
            <Input
              placeholder="Search circuits, line numbers, heater families…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="max-w-sm"
            />

            {/* Table */}
            <div className="border border-border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/60 border-b border-border">
                      {['Circuit Name', 'Line Number', 'Control Type', 'Maint. Temp.', 'Volts', 'Pipe Len.', 'Heater Family', 'Status'].map(h => (
                        <th key={h} className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((c) => (
                      <tr key={c.id} className="border-b border-border/60 hover:bg-accent/30 transition-colors">
                        <td className="px-4 py-3 font-medium text-foreground">{c.circuitName}</td>
                        <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{c.lineNumber}</td>
                        <td className="px-4 py-3 text-muted-foreground">{c.tempControlType}</td>
                        <td className="px-4 py-3 text-foreground">{c.maintTemp}°F</td>
                        <td className="px-4 py-3 text-foreground">{c.volts}V</td>
                        <td className="px-4 py-3 text-foreground">{c.pipeLen} ft</td>
                        <td className="px-4 py-3 text-foreground">{c.heaterFamily}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_STYLES[c.status] || 'bg-muted text-muted-foreground'}`}>
                            {c.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr><td colSpan={8} className="text-center text-muted-foreground py-10 text-sm">No circuits found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}