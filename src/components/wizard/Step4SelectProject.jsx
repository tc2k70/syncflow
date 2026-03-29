import { useState, useEffect } from 'react';
import { Search, RefreshCw, ChevronLeft, ChevronRight, Circle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { fetchProjects } from '@/lib/mockApi';
import { cn } from '@/lib/utils';

const MOCK_CIRCUITS = {
  'PRJ-001': [
    { name: '2-0', segments: 1, class: 'DB_ES_ClassName_NEC_Divisions_Ordinary', voltage: '120 Vac', controlType: 'DB_TemperatureControlType_PipeSensing', temps: '40 °F / 35 °F / 35 °F', status: 'ok' },
    { name: '3-0', segments: 1, class: 'DB_ES_ClassName_NEC_Divisions_Ordinary', voltage: '120 Vac', controlType: 'DB_TemperatureControlType_PipeSensing', temps: '40 °F / 35 °F / 35 °F', status: 'ok' },
    { name: '1-0', segments: 1, class: 'DB_ES_ClassName_NEC_Divisions_Ordinary', voltage: '120 Vac', controlType: 'DB_TemperatureControlType_PipeSensing', temps: '40 °F / 35 °F / 35 °F', status: 'error' },
  ],
  'PRJ-002': [
    { name: 'A-1', segments: 2, class: 'DB_ES_ClassName_NEC_Divisions_Ordinary', voltage: '240 Vac', controlType: 'DB_TemperatureControlType_PipeSensing', temps: '50 °F / 45 °F / 40 °F', status: 'ok' },
    { name: 'B-1', segments: 1, class: 'DB_ES_ClassName_NEC_Divisions_Ordinary', voltage: '240 Vac', controlType: 'DB_TemperatureControlType_PipeSensing', temps: '50 °F / 45 °F / 40 °F', status: 'ok' },
  ],
};

function CircuitDetailPanel({ circuit }) {
  if (!circuit) return (
    <div className="flex items-center justify-center h-full text-sm text-muted-foreground p-6 text-center">
      Select a circuit to view details
    </div>
  );
  return (
    <div className="p-4 flex flex-col gap-3">
      <p className="font-semibold text-sm text-foreground">{circuit.name}</p>
      <div className="border-t border-border pt-3 flex flex-col gap-2 text-xs">
        <DetailRow label="Segments" value={circuit.segments} />
        <DetailRow label="Class" value={circuit.class} accent />
        <DetailRow label="Voltage" value={circuit.voltage} accent />
        <DetailRow label="Control Type" value={circuit.controlType} accent />
        <DetailRow label="Maint / Proc / Upset" value={circuit.temps} />
        <DetailRow label="Status" value={circuit.status === 'error' ? 'Error' : 'OK'} accent={circuit.status !== 'error'} />
      </div>
    </div>
  );
}

function ProjectDetailPanel({ project }) {
  if (!project) return (
    <div className="flex items-center justify-center h-full text-sm text-muted-foreground p-6 text-center">
      Select a project to view details
    </div>
  );

  return (
    <div className="p-4 flex flex-col gap-3">
      <p className="font-semibold text-sm text-foreground">{project.name}</p>
      <div className="border-t border-border pt-3 flex flex-col gap-2 text-xs">
        <DetailRow label="Project #" value={project.id} accent />
        <DetailRow label="Agency" value={project.agency} />
        <DetailRow label="Area Type" value={project.areaType} accent />
        <DetailRow label="Project Owner" value={project.owner} accent />
        <DetailRow label="Last Modified" value={project.lastModified} />
      </div>
      <div className="border-t border-border pt-3">
        <p className="text-xs font-semibold text-muted-foreground mb-2">Units</p>
        <div className="flex flex-col gap-1.5 text-xs">
          <DetailRow label="Pipe" value={project.units?.pipe} accent />
          <DetailRow label="Insulation" value={project.units?.insulation} accent />
          <DetailRow label="Temperature" value={project.units?.temperature} accent />
          <DetailRow label="Other" value={project.units?.other} accent />
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value, accent }) {
  return (
    <div className="flex justify-between gap-2">
      <span className="text-muted-foreground shrink-0">{label}</span>
      <span className={cn('font-medium text-right', accent ? 'text-primary' : 'text-foreground')}>{value ?? '—'}</span>
    </div>
  );
}

export default function Step4SelectProject({ onNext, onBack }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [selectedCircuit, setSelectedCircuit] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchProjects().then(data => { setProjects(data); setLoading(false); });
  }, []);

  const filtered = projects.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.id.toLowerCase().includes(search.toLowerCase())
  );

  const circuits = selected ? (MOCK_CIRCUITS[selected.id] ?? []) : [];

  const handleSelectProject = (project) => {
    setSelected(project);
    setSelectedCircuit(null);
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-none">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">Select Project</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Choose a project from the database to import circuits into.</p>
      </div>

      {/* Top grid row: projects table + detail panel */}
      <div className="flex gap-4 items-start md:flex-row">
        {/* Projects table */}
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
            <Button variant="ghost" size="sm" className="gap-1.5 text-xs h-7 px-2 shrink-0" onClick={() => { setLoading(true); fetchProjects().then(d => { setProjects(d); setLoading(false); }); }}>
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
                  <th className="text-left px-4 py-2.5 font-semibold text-foreground">Agency</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-foreground">Area Type</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-foreground">Pipe / Insulation / Temperature / Other Unit</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(project => (
                  <tr
                    key={project.id}
                    onClick={() => handleSelectProject(project)}
                    className={cn(
                      'border-b border-border/50 cursor-pointer transition-colors',
                      selected?.id === project.id ? 'bg-primary/10' : 'hover:bg-accent/40'
                    )}
                  >
                    <td className="px-4 py-2.5">
                      <span className={cn('font-medium', selected?.id === project.id ? 'text-primary' : 'text-foreground')}>{project.name}</span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={cn(selected?.id === project.id ? 'text-primary' : 'text-foreground')}>{project.id}</span>
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground">{project.agency}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">{project.areaType}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">{project.unitSummary}</td>
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
              <span>Rows per page: 10</span>
              <span>1–{filtered.length} of {filtered.length}</span>
              <Button variant="ghost" size="icon" className="w-6 h-6" disabled><ChevronLeft className="w-3.5 h-3.5" /></Button>
              <Button variant="ghost" size="icon" className="w-6 h-6" disabled><ChevronRight className="w-3.5 h-3.5" /></Button>
            </div>
          </div>
        </div>

        {/* Detail panel */}
        <div className="md:flex-row md:w-56 shrink-0 border border-border rounded-lg bg-card min-h-[200px]">
          <ProjectDetailPanel project={selected} />
        </div>
      </div>

      {/* Circuits sub-grid */}
      <div className="flex gap-4 items-start">
        <div className="flex-1 min-w-0 border border-border rounded-lg overflow-hidden bg-card flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-4 py-2.5 font-semibold text-foreground">Circuit Name</th>
                <th className="text-left px-4 py-2.5 font-semibold text-foreground">Segments</th>
                <th className="text-left px-4 py-2.5 font-semibold text-foreground">Class</th>
                <th className="text-left px-4 py-2.5 font-semibold text-foreground">Voltage</th>
                <th className="text-left px-4 py-2.5 font-semibold text-foreground">Control Type</th>
                <th className="text-left px-4 py-2.5 font-semibold text-foreground">Maintain / Process / Upset</th>
              </tr>
            </thead>
            <tbody>
              {circuits.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8 text-muted-foreground">{selected ? 'No circuits found.' : 'Select a project to view circuits.'}</td></tr>
              ) : circuits.map((c, i) => (
                <tr key={i} onClick={() => setSelectedCircuit(c)} className={cn('border-b border-border/50 cursor-pointer transition-colors', selectedCircuit?.name === c.name ? 'bg-primary/10' : 'hover:bg-accent/30')}>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <Circle className={cn('w-2.5 h-2.5 shrink-0', c.status === 'error' ? 'fill-destructive text-destructive' : 'fill-transparent text-muted-foreground/40')} />
                      <span className={cn('font-medium', selectedCircuit?.name === c.name ? 'text-primary' : 'text-foreground')}>{c.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground">{c.segments}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{c.class}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{c.voltage}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{c.controlType}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{c.temps}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-border text-xs text-muted-foreground gap-2">
          <span>{selectedCircuit ? '1 row selected' : ''}</span>
          <div className="flex items-center gap-2">
            <span>Rows per page: 10</span>
            <span>1–{circuits.length} of {circuits.length}</span>
            <Button variant="ghost" size="icon" className="w-6 h-6" disabled><ChevronLeft className="w-3.5 h-3.5" /></Button>
            <Button variant="ghost" size="icon" className="w-6 h-6" disabled><ChevronRight className="w-3.5 h-3.5" /></Button>
          </div>
        </div>
        </div>

        {/* Circuit detail panel */}
        <div className="w-56 shrink-0 border border-border rounded-lg bg-card min-h-[160px]">
          <CircuitDetailPanel circuit={selectedCircuit} />
        </div>
      </div>

      <div className="flex justify-between pt-2">
        {onBack ? <Button variant="outline" onClick={onBack}>← Back</Button> : <span />}
        <Button onClick={() => onNext(selected)} disabled={!selected}>
          Select File →
        </Button>
      </div>
    </div>
  );
}