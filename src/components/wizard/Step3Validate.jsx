import { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { validateData } from '@/lib/mockApi';

export default function Step3Validate({ rows, onNext, onBack }) {
  const [status, setStatus] = useState('idle'); // idle | loading | done
  const [result, setResult] = useState(null);

  useEffect(() => {
    runValidation();
  }, []);

  const runValidation = async () => {
    setStatus('loading');
    const res = await validateData(rows);
    setResult(res);
    setStatus('done');
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">Validate Data</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Checking {rows.length} rows against field rules and lookup values.</p>
      </div>

      {status === 'loading' && (
        <div className="flex flex-col items-center gap-3 py-12 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm">Running validation checks…</p>
        </div>
      )}

      {status === 'done' && result && (
        <div className="flex flex-col gap-4">
          {/* Summary */}
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-1 p-4 rounded-lg border border-border bg-card">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Total Rows</span>
              <span className="text-2xl font-semibold text-foreground">{rows.length}</span>
            </div>
            <div className={`flex flex-col gap-1 p-4 rounded-lg border ${result.errors.length > 0 ? 'border-destructive/40 bg-destructive/5' : 'border-border bg-card'}`}>
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Errors</span>
              <span className={`text-2xl font-semibold ${result.errors.length > 0 ? 'text-destructive' : 'text-foreground'}`}>{result.errors.length}</span>
            </div>
            <div className={`flex flex-col gap-1 p-4 rounded-lg border ${result.warnings.length > 0 ? 'border-yellow-400/40 bg-yellow-400/5' : 'border-border bg-card'}`}>
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Warnings</span>
              <span className={`text-2xl font-semibold ${result.warnings.length > 0 ? 'text-yellow-600 dark:text-yellow-400' : 'text-foreground'}`}>{result.warnings.length}</span>
            </div>
          </div>

          {/* Status banner */}
          {result.valid ? (
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">All rows passed validation — ready to continue.</p>
            </div>
          ) : (
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-destructive/5 border border-destructive/20">
              <AlertCircle className="w-5 h-5 text-destructive" />
              <p className="text-sm font-medium text-destructive">{result.errors.length} error(s) found. Review below before proceeding.</p>
            </div>
          )}

          {/* Errors list */}
          {result.errors.length > 0 && (
            <div className="border border-border rounded-lg overflow-hidden">
              <div className="px-4 py-2.5 bg-muted/50 border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                <AlertCircle className="w-3.5 h-3.5 text-destructive" /> Errors
              </div>
              <div className="divide-y divide-border">
                {result.errors.map((e, i) => (
                  <div key={i} className="flex items-start gap-3 px-4 py-3 text-sm">
                    <Badge variant="destructive" className="text-xs shrink-0 mt-0.5">Row {e.row}</Badge>
                    <div>
                      <span className="font-medium text-foreground">{e.field}</span>
                      <span className="text-muted-foreground"> — {e.message}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Warnings list */}
          {result.warnings.length > 0 && (
            <div className="border border-border rounded-lg overflow-hidden">
              <div className="px-4 py-2.5 bg-muted/50 border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-yellow-500" /> Warnings
              </div>
              <div className="divide-y divide-border">
                {result.warnings.map((w, i) => (
                  <div key={i} className="flex items-start gap-3 px-4 py-3 text-sm">
                    <Badge className="text-xs shrink-0 mt-0.5 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400 border-yellow-200 dark:border-yellow-700">Row {w.row}</Badge>
                    <div>
                      <span className="font-medium text-foreground">{w.field}</span>
                      <span className="text-muted-foreground"> — {w.message}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex justify-between pt-2">
        <Button variant="outline" onClick={onBack}>Back</Button>
        <div className="flex gap-2">
          {status === 'done' && (
            <Button variant="outline" onClick={runValidation}>Re-run</Button>
          )}
          <Button onClick={onNext} disabled={status !== 'done'}>
            {result?.valid ? 'Continue' : 'Continue Anyway'}
          </Button>
        </div>
      </div>
    </div>
  );
}