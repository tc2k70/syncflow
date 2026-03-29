import { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle2, Loader2, CopyX } from 'lucide-react';
import WizardBreadcrumb from './WizardBreadcrumb';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { preMergeCheck } from '@/lib/mockApi';
import { cn } from '@/lib/utils';

export default function Step5PreMerge({ rows, project, fileInfo, onNext, onBack }) {
  const [status, setStatus] = useState('loading');
  const [result, setResult] = useState(null);

  useEffect(() => {
    preMergeCheck(rows, project.id).then(res => {
      setResult(res);
      setStatus('done');
    });
  }, []);

  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto">
      <WizardBreadcrumb project={project} fileInfo={fileInfo} />
      <div>
        <h2 className="text-2xl font-semibold text-foreground">Pre-Merge Check</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Checking for duplicate records in <span className="font-medium text-foreground">{project.name}</span>.
        </p>
      </div>

      {status === 'loading' && (
        <div className="flex flex-col items-center gap-3 py-12 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm">Scanning target project for conflicts…</p>
        </div>
      )}

      {status === 'done' && result && (
        <div className="flex flex-col gap-4">
          {/* Summary row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-1 p-4 rounded-lg border border-border bg-card">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">New Records</span>
              <span className="text-2xl font-semibold text-emerald-600 dark:text-emerald-400">{result.newRecords.length}</span>
            </div>
            <div className={cn('flex flex-col gap-1 p-4 rounded-lg border bg-card', result.duplicates.length > 0 ? 'border-yellow-400/40 bg-yellow-400/5' : 'border-border')}>
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Duplicates</span>
              <span className={cn('text-2xl font-semibold', result.duplicates.length > 0 ? 'text-yellow-600 dark:text-yellow-400' : 'text-foreground')}>{result.duplicates.length}</span>
            </div>
            <div className="flex flex-col gap-1 p-4 rounded-lg border border-border bg-card">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Total Rows</span>
              <span className="text-2xl font-semibold text-foreground">{result.totalRows}</span>
            </div>
          </div>

          {result.duplicates.length === 0 ? (
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">No duplicate records found. Safe to proceed with import.</p>
            </div>
          ) : (
            <div className="flex items-start gap-3 px-4 py-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800">
              <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5" />
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                <span className="font-semibold">{result.duplicates.length} duplicate(s) detected.</span> These rows already exist in the target project. Importing will overwrite the conflicting fields listed below.
              </p>
            </div>
          )}

          {result.duplicates.length > 0 && (
            <div className="border border-border rounded-lg overflow-hidden">
              <div className="px-4 py-2.5 bg-muted/50 border-b border-border flex items-center gap-2">
                <CopyX className="w-4 h-4 text-yellow-500" />
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Duplicate Records</span>
              </div>
              <div className="divide-y divide-border">
                {result.duplicates.map((dup, i) => (
                  <div key={i} className="flex items-center gap-3 px-4 py-3 text-sm">
                    <Badge variant="secondary" className="text-xs shrink-0">Row {dup.row}</Badge>
                    <div className="flex-1 min-w-0">
                      <span className="font-medium text-foreground">{dup.circuitName}</span>
                      <span className="text-muted-foreground"> / {dup.lineNumber}</span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-xs text-muted-foreground">Conflicts:</span>
                      {dup.conflictFields.map(f => (
                        <Badge key={f} variant="outline" className="text-xs text-yellow-700 dark:text-yellow-400 border-yellow-300 dark:border-yellow-700">{f}</Badge>
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">{dup.existingId}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between gap-2 pt-2">
        <Button variant="outline" onClick={onBack}>← Back</Button>
        <Button onClick={onNext} disabled={status !== 'done'}>
          Proceed to Approval
        </Button>
      </div>
    </div>
  );
}