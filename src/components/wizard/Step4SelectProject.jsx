import { useState, useEffect } from 'react';
import { Database, Check, Loader2, Search, Lightbulb, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { fetchProjects } from '@/lib/mockApi';
import { cn } from '@/lib/utils';

const TIPS = [
  'Select the project that matches your line list data',
  'Ensure the project ID matches your engineering documents',
  'Contact your admin if the project is not listed',
  'Double-check the site location before proceeding',
];

function SelectedProjectPanel({ project }) {
  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="px-4 py-2.5 border-b border-primary/40" style={{ background: 'var(--thermon-black)' }}>
        <span className="text-xs font-bold uppercase tracking-widest text-white" style={{ fontFamily: "'Oswald', sans-serif" }}>Selected Project</span>
      </div>
      <div className="p-4 flex flex-col gap-2.5 text-sm">
        {project ? (
          <>
            <Row label="Name" value={project.name} />
            <Row label="Project #" value={project.id} />
            <Row label="Site" value={project.site} />
            <Row label="Status" value={project.status} highlight />
          </>
        ) : (
          <p className="text-xs text-muted-foreground italic">No project selected yet.</p>
        )}
      </div>
    </div>
  );
}

function Row({ label, value, highlight }) {
  return (
    <div className="flex justify-between gap-2">
      <span className="text-muted-foreground text-xs">{label}</span>
      <span className={cn('text-xs font-semibold text-right', highlight ? 'text-emerald-600 dark:text-emerald-400' : 'text-foreground')}>{value}</span>
    </div>
  );
}

function TipsPanel() {
  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="px-4 py-2.5 border-b border-primary/40 flex items-center gap-2" style={{ background: 'var(--thermon-black)' }}>
        <Lightbulb className="w-3.5 h-3.5 text-yellow-400" />
        <span className="text-xs font-bold uppercase tracking-widest text-white" style={{ fontFamily: "'Oswald', sans-serif" }}>Tips</span>
      </div>
      <ul className="p-4 flex flex-col gap-2">
        {TIPS.map((tip, i) => (
          <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
            <span className="text-primary mt-0.5">•</span>{tip}
          </li>
        ))}
      </ul>
    </div>
  );
}

function RecentUploadsPanel() {
  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="px-4 py-2.5 border-b border-primary/40 flex items-center gap-2" style={{ background: 'var(--thermon-black)' }}>
        <Clock className="w-3.5 h-3.5 text-primary" />
        <span className="text-xs font-bold uppercase tracking-widest text-white" style={{ fontFamily: "'Oswald', sans-serif" }}>Recent Uploads</span>
      </div>
      <div className="p-4">
        <p className="text-xs text-muted-foreground italic text-center">No recent uploads</p>
      </div>
    </div>
  );
}

export default function Step4SelectProject({ onNext, onBack }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchProjects().then(data => { setProjects(data); setLoading(false); });
  }, []);

  const filtered = projects.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.id.toLowerCase().includes(search.toLowerCase()) ||
    p.site.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex gap-6 w-full">
      {/* Left sidebar */}
      <div className="w-56 shrink-0 flex flex-col gap-4">
        <SelectedProjectPanel project={selected} />
        <TipsPanel />
        <RecentUploadsPanel />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col gap-5">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Select Target Project</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Choose the project in the SQL database to merge this data into.</p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search projects…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {filtered.map(project => (
              <button
                key={project.id}
                onClick={() => setSelected(project)}
                className={cn(
                  'w-full flex items-center gap-4 px-4 py-3.5 rounded-lg border transition-all text-left',
                  selected?.id === project.id
                    ? 'border-primary bg-primary/5 ring-1 ring-primary/30'
                    : 'border-border hover:border-primary/40 hover:bg-accent/40 bg-card'
                )}
              >
                <Database className={cn('w-5 h-5 shrink-0', selected?.id === project.id ? 'text-primary' : 'text-muted-foreground')} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-foreground truncate">{project.name}</span>
                    <Badge variant="secondary" className="text-xs shrink-0">{project.id}</Badge>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs text-muted-foreground">{project.site}</span>
                    <span className="text-xs text-muted-foreground">·</span>
                    <span className="text-xs text-muted-foreground">{project.circuitCount} circuits</span>
                    <span className="text-xs text-muted-foreground">·</span>
                    <span className={cn('text-xs font-medium', project.status === 'Active' ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground')}>{project.status}</span>
                  </div>
                </div>
                {selected?.id === project.id && (
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-primary-foreground" />
                  </div>
                )}
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="text-center text-sm text-muted-foreground py-8">No projects found matching "{search}"</p>
            )}
          </div>
        )}

        <div className="flex justify-between pt-2">
          <Button variant="outline" onClick={onBack}>← Back</Button>
          <Button onClick={() => onNext(selected)} disabled={!selected}>
            Run Pre-Merge Check →
          </Button>
        </div>
      </div>
    </div>
  );
}