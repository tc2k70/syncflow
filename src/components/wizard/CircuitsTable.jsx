import { useState } from 'react';
import { ChevronLeft, ChevronRight, Circle } from 'lucide-react';
import DetailPopup from './DetailPopup';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import CircuitDetailPanel from './CircuitDetailPanel';

export default function CircuitsTable({ circuits, selected, onSelect, projectSelected }) {
  const [popup, setPopup] = useState(null); // { circuit, x, y }

  return (
    <div className="flex gap-4 items-start">
      <div className="flex-1 min-w-0 border border-border rounded-lg overflow-hidden bg-card flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-4 py-2.5 font-semibold text-foreground">Circuit Name</th>
                <th className="text-left px-4 py-2.5 font-semibold text-foreground hidden sm:table-cell">Segments</th>
                <th className="text-left px-4 py-2.5 font-semibold text-foreground hidden md:table-cell">Class</th>
                <th className="text-left px-4 py-2.5 font-semibold text-foreground hidden sm:table-cell">Voltage</th>
                <th className="text-left px-4 py-2.5 font-semibold text-foreground hidden lg:table-cell">Control Type</th>
                <th className="text-left px-4 py-2.5 font-semibold text-foreground hidden xl:table-cell">Maintain / Process / Upset</th>
              </tr>
            </thead>
            <tbody>
              {circuits.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8 text-muted-foreground">
                  {projectSelected ? 'No circuits found.' : 'Select a project to view circuits.'}
                </td></tr>
              ) : circuits.map((c, i) => (
                <tr
                  key={i}
                  onClick={() => onSelect(c)}
                  className={cn('border-b border-border/50 cursor-pointer transition-colors', selected?.name === c.name ? 'bg-primary/10' : 'hover:bg-accent/30')}
                >
                  <td className="px-4 py-2.5 max-w-[120px]">
                    <div className="flex items-center gap-2">
                      <Circle className={cn('w-2.5 h-2.5 shrink-0', c.status === 'error' ? 'fill-destructive text-destructive' : 'fill-transparent text-muted-foreground/40')} />
                      <span
                        className={cn('font-medium truncate md:cursor-default cursor-pointer', selected?.name === c.name ? 'text-primary' : 'text-foreground')}
                        title={c.name}
                        onClick={e => { e.stopPropagation(); setPopup(p => p?.circuit?.name === c.name ? null : { circuit: c, x: e.clientX, y: e.clientY }); }}
                      >{c.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground hidden sm:table-cell">{c.segments}</td>
                  <td className="px-4 py-2.5 text-muted-foreground hidden md:table-cell max-w-[140px]">
                    <span className="truncate block" title={c.class}>{c.class}</span>
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground hidden sm:table-cell">{c.voltage}</td>
                  <td className="px-4 py-2.5 text-muted-foreground hidden lg:table-cell max-w-[140px]">
                    <span className="truncate block" title={c.controlType}>{c.controlType}</span>
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground hidden xl:table-cell max-w-[160px]">
                    <span className="truncate block" title={c.temps}>{c.temps}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-border text-xs text-muted-foreground gap-2">
          <span>{selected ? '1 row selected' : ''}</span>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline">Rows per page: 10</span>
            <span>1–{circuits.length} of {circuits.length}</span>
            <Button variant="ghost" size="icon" className="w-6 h-6" disabled><ChevronLeft className="w-3.5 h-3.5" /></Button>
            <Button variant="ghost" size="icon" className="w-6 h-6" disabled><ChevronRight className="w-3.5 h-3.5" /></Button>
          </div>
        </div>
      </div>

      {/* Side detail panel — desktop only */}
      <div className="w-56 shrink-0 border border-border rounded-lg bg-card min-h-[160px] hidden md:block">
        <CircuitDetailPanel circuit={selected} />
      </div>

      {popup && (
        <DetailPopup pos={{ x: popup.x, y: popup.y }} onClose={() => setPopup(null)}>
          <CircuitDetailPanel circuit={popup.circuit} />
        </DetailPopup>
      )}
    </div>
  );
}