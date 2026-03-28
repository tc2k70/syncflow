import { useState, useEffect } from 'react';
import { Database, Check, Loader2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { fetchProjects } from '@/lib/mockApi';
import { cn } from '@/lib/utils';

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
    <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto">
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
        <Button variant="outline" onClick={onBack}>Back</Button>
        <Button onClick={() => onNext(selected)} disabled={!selected}>
          Run Pre-Merge Check
        </Button>
      </div>
    </div>
  );
}