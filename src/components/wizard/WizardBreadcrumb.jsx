import { useState, useRef } from 'react';
import { ChevronRight, FolderOpen, FileSpreadsheet } from 'lucide-react';
import { cn } from '@/lib/utils';

function BreadcrumbItem({ icon: Icon, label, sublabel, details, color = 'text-primary' }) {
  const [open, setOpen] = useState(false);
  const timer = useRef(null);

  const show = () => { clearTimeout(timer.current); setOpen(true); };
  const hide = () => { timer.current = setTimeout(() => setOpen(false), 100); };

  if (!label) return null;

  return (
    <div className="relative" onMouseEnter={show} onMouseLeave={hide}>
      <div className={cn('flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium cursor-default transition-colors', 'hover:bg-accent/60', color)}>
        <Icon className="w-3.5 h-3.5 shrink-0" />
        <span className="truncate max-w-[140px]">{label}</span>
      </div>

      {open && details && (
        <div className="absolute top-full left-0 mt-1.5 z-50 min-w-[180px] rounded-lg border border-border bg-popover shadow-lg p-3 flex flex-col gap-2">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{sublabel}</p>
          {details.map(({ key, value }) => value ? (
            <div key={key} className="flex justify-between gap-4">
              <span className="text-xs text-muted-foreground">{key}</span>
              <span className="text-xs font-medium text-foreground text-right truncate max-w-[120px]">{value}</span>
            </div>
          ) : null)}
        </div>
      )}
    </div>
  );
}

export default function WizardBreadcrumb({ project, fileInfo }) {
  if (!project && !fileInfo) return null;

  const projectDetails = project ? [
    { key: 'ID', value: project.id },
    { key: 'Site', value: project.site },
    { key: 'Status', value: project.status },
    { key: 'Circuits', value: project.circuitCount != null ? `${project.circuitCount}` : null },
  ] : null;

  const fileDetails = fileInfo ? [
    { key: 'File', value: fileInfo.name },
    { key: 'Size', value: fileInfo.size ? `${(fileInfo.size / 1024).toFixed(1)} KB` : null },
  ] : null;

  return (
    <div className="flex items-center gap-1 flex-wrap">
      {project && (
        <BreadcrumbItem
          icon={FolderOpen}
          label={project.name}
          sublabel="Selected Project"
          details={projectDetails}
          color="text-primary"
        />
      )}
      {project && fileInfo && (
        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
      )}
      {fileInfo && (
        <BreadcrumbItem
          icon={FileSpreadsheet}
          label={fileInfo.name}
          sublabel="Uploaded File"
          details={fileDetails}
          color="text-foreground"
        />
      )}
    </div>
  );
}