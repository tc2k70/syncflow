import { useState } from 'react';
import { Search, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import ProjectDetailPanel from './ProjectDetailPanel';

export default function ProjectsTable({ projects, loading, selected, onSelect, onReload }) {
  const [search, setSearch] = useState('');
  const [popup, setPopup] = useState(null);

  const filtered = projects.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex gap-4 items-start">
      <div className="flex-1 min-w-0 border border-border rounded-lg overflow-hidden bg-card flex flex-col">
        {/* Toolbar */}
        <div className="flex items-center gap-2 px-3 py-2 border-b border-border">
          <Search className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <Input
            placeholder="Search for Project names…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="h-7 text-xs border-0 shadow-none focus-visible:ring-0 bg-transparent p-0 placeholder:text-muted-foreground"
          />
          <Button variant="ghost" size="sm" className="gap-1.5 text-xs h-7 px-2 shrink-0" onClick={onReload}>
            <RefreshCw className="w-3 h-3" /> RELOAD
          </Button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-4 py-2.5 font-semibold text-foreground">Project Name</th>
                <th className="text-left px-4 py-2.5 font-semibold text-foreground">Project #</th>
                <th className="text-left px-4 py-2.5 font-semibold text-foreground hidden sm:table-cell">Agency</th>
                <th className="text-left px-4 py-2.5 font-semibold text-foreground hidden lg:table-cell">Area Type</th>
                <th className="text-left px-4 py-2.5 font-semibold text-foreground hidden xl:table-cell">Pipe / Insulation / Temperature / Other Unit</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(project => (
                <tr
                  key={project.id}
                  onClick={() => onSelect(project)}
                  className={cn(
                    'border-b border-border/50 cursor-pointer transition-colors',
                    selected?.id === project.id ? 'bg-primary/10' : 'hover:bg-accent/40'
                  )}
                >
                  <td className="px-4 py-2.5 max-w-[160px]">
                    <span
                      className={cn('font-medium truncate block md:cursor-default cursor-pointer', selected?.id === project.id ? 'text-primary' : 'text-foreground')}
                      title={project.name}
                      onClick={e => { e.stopPropagation(); setPopup(p => p?.id === project.id ? null : project); }}
                    >{project.name}</span>
                  </td>
                  <td className="px-4 py-2.5 max-w-[80px]">
                    <span
                      className={cn('truncate block md:cursor-default cursor-pointer', selected?.id === project.id ? 'text-primary' : 'text-foreground')}
                      title={project.id}
                      onClick={e => { e.stopPropagation(); setPopup(p => p?.id === project.id ? null : project); }}
                    >{project.id}</span>
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground hidden sm:table-cell">{project.agency}</td>
                  <td className="px-4 py-2.5 text-muted-foreground hidden lg:table-cell max-w-[120px]">
                    <span className="truncate block" title={project.areaType}>{project.areaType}</span>
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground hidden xl:table-cell max-w-[200px]">
                    <span className="truncate block" title={project.unitSummary}>{project.unitSummary}</span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && !loading && (
                <tr><td colSpan={5} className="text-center py-8 text-muted-foreground">No projects found</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-border mt-auto text-xs text-muted-foreground">
          <span>{selected ? '1 row selected' : ''}</span>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline">Rows per page: 10</span>
            <span>1–{filtered.length} of {filtered.length}</span>
            <Button variant="ghost" size="icon" className="w-6 h-6" disabled><ChevronLeft className="w-3.5 h-3.5" /></Button>
            <Button variant="ghost" size="icon" className="w-6 h-6" disabled><ChevronRight className="w-3.5 h-3.5" /></Button>
          </div>
        </div>
      </div>

      {/* Side detail panel — desktop only */}
      <div className="w-56 shrink-0 border border-border rounded-lg bg-card min-h-[200px] hidden md:block">
        <ProjectDetailPanel project={selected} />
      </div>

      {/* Click popup — mobile only */}
      {popup && (
        <div className="md:hidden fixed bottom-4 left-4 right-4 z-50 border border-border rounded-lg bg-card shadow-xl">
          <ProjectDetailPanel project={popup} />
        </div>
      )}
    </div>
  );
}