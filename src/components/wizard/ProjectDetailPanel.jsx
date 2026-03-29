import { cn } from '@/lib/utils';

function DetailRow({ label, value, accent }) {
  return (
    <div className="flex justify-between gap-2 min-w-0">
      <span className="text-muted-foreground shrink-0">{label}</span>
      <span className={cn('font-medium text-right truncate', accent ? 'text-primary' : 'text-foreground')} title={String(value ?? '')}>{value ?? '—'}</span>
    </div>
  );
}

export default function ProjectDetailPanel({ project }) {
  if (!project) return (
    <div className="flex items-center justify-center h-full text-sm text-muted-foreground p-6 text-center">
      Select a project to view details
    </div>
  );

  return (
    <div className="p-4 flex flex-col gap-3">
      <p className="font-semibold text-sm text-foreground truncate" title={project.name}>{project.name}</p>
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