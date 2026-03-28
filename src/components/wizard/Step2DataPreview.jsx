import { useState } from 'react';
import { FileSpreadsheet, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LINE_LIST_COLUMNS } from '@/lib/lineListColumns';
import { ScrollArea } from '@/components/ui/scroll-area';

const PAGE_SIZE = 10;

export default function Step2DataPreview({ rows, fileInfo, onNext, onBack }) {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(rows.length / PAGE_SIZE);
  const visibleRows = rows.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const visibleCols = LINE_LIST_COLUMNS.slice(0, 12); // show first 12 columns in preview

  return (
    <div className="flex flex-col gap-5 w-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Preview Imported Data</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Showing worksheet 1 from <span className="font-medium text-foreground">{fileInfo?.name}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">{rows.length} rows</Badge>
          <Badge variant="secondary" className="text-xs">{LINE_LIST_COLUMNS.length} columns</Badge>
        </div>
      </div>

      <div className="border border-border rounded-lg overflow-hidden">
        <ScrollArea className="w-full" orientation="horizontal">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/60 border-b border-border">
                  <th className="text-left text-xs font-semibold text-muted-foreground px-3 py-2.5 whitespace-nowrap w-8">#</th>
                  {visibleCols.map(col => (
                    <th key={col.key} className="text-left text-xs font-semibold text-muted-foreground px-3 py-2.5 whitespace-nowrap">
                      {col.label}
                      {col.required && <span className="text-destructive ml-0.5">*</span>}
                    </th>
                  ))}
                  <th className="text-left text-xs font-semibold text-muted-foreground px-3 py-2.5 text-muted-foreground/60">
                    +{LINE_LIST_COLUMNS.length - 12} more cols…
                  </th>
                </tr>
              </thead>
              <tbody>
                {visibleRows.map((row, idx) => (
                  <tr key={idx} className="border-b border-border/60 hover:bg-accent/30 transition-colors">
                    <td className="px-3 py-2 text-xs text-muted-foreground">{page * PAGE_SIZE + idx + 1}</td>
                    {visibleCols.map(col => (
                      <td key={col.key} className="px-3 py-2 text-xs text-foreground whitespace-nowrap max-w-[140px] truncate">
                        {row[col.key] ?? <span className="text-muted-foreground/40">—</span>}
                      </td>
                    ))}
                    <td />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ScrollArea>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-end gap-2 text-sm text-muted-foreground">
          <Button variant="ghost" size="icon" onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span>Page {page + 1} of {totalPages}</span>
          <Button variant="ghost" size="icon" onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      <div className="flex justify-between pt-2">
        <Button variant="outline" onClick={onBack}>Back</Button>
        <Button onClick={onNext}>Continue to Validation</Button>
      </div>
    </div>
  );
}