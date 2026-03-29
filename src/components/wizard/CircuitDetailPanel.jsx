import { cn } from '@/lib/utils';

function DetailRow({ label, value, accent }) {
  return (
    <div className="flex justify-between gap-2 min-w-0">
      <span className="text-muted-foreground shrink-0">{label}</span>
      <span className={cn('font-medium text-right truncate', accent ? 'text-primary' : 'text-foreground')} title={String(value ?? '')}>{value ?? '—'}</span>
    </div>
  );
}

export default function CircuitDetailPanel({ circuit }) {
  if (!circuit) return (
    <div className="flex items-center justify-center h-full text-sm text-muted-foreground p-6 text-center">
      Select a circuit to view details
    </div>
  );

  return (
    <div className="p-4 flex flex-col gap-3">
      <p className="font-semibold text-sm text-foreground truncate" title={circuit.name}>{circuit.name}</p>
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