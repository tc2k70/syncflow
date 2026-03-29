import { useState } from 'react';
import { ShieldCheck, Loader2, CheckCircle2, ArrowRight } from 'lucide-react';
import WizardBreadcrumb from './WizardBreadcrumb';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { executeImport } from '@/lib/mockApi';
import { useNavigate } from 'react-router-dom';

export default function Step6ApproveImport({ rows, project, fileInfo, mergeResult, onBack, onImportDone }) {
  const [confirmed, setConfirmed] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | loading | done
  const [importResult, setImportResult] = useState(null);
  const navigate = useNavigate();

  const handleImport = async () => {
    setStatus('loading');
    const res = await executeImport(mergeResult?.newRecords || rows, project.id);
    setImportResult(res);
    setStatus('done');
  };

  const handleViewProject = () => {
    onImportDone(importResult);
    navigate(`/project/${project.id}`);
  };

  if (status === 'done' && importResult) {
    return (
      <div className="flex flex-col items-center gap-6 max-w-md mx-auto py-8 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Import Complete</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Successfully imported <span className="font-semibold text-foreground">{importResult.imported} circuits</span> into {project.name}.
          </p>
        </div>
        <div className="w-full grid grid-cols-2 gap-3 text-left">
          <div className="p-3 rounded-lg border border-border bg-card">
            <p className="text-xs text-muted-foreground">Import ID</p>
            <p className="text-sm font-medium text-foreground mt-0.5">{importResult.importId}</p>
          </div>
          <div className="p-3 rounded-lg border border-border bg-card">
            <p className="text-xs text-muted-foreground">Timestamp</p>
            <p className="text-sm font-medium text-foreground mt-0.5">{new Date(importResult.timestamp).toLocaleString()}</p>
          </div>
        </div>
        <Button className="w-full gap-2" onClick={handleViewProject}>
          View Project Data <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto">
      <WizardBreadcrumb project={project} fileInfo={fileInfo} />
      <div>
        <h2 className="text-2xl font-semibold text-foreground">Approve & Import</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Review the import summary and confirm to proceed.</p>
      </div>

      {/* Summary card */}
      <div className="border border-border rounded-xl p-5 bg-card flex flex-col gap-4">
        <div className="flex items-center gap-3 pb-3 border-b border-border">
          <ShieldCheck className="w-5 h-5 text-primary" />
          <span className="font-semibold text-foreground text-sm">Import Summary</span>
        </div>
        <div className="grid grid-cols-2 gap-y-3 text-sm">
          <span className="text-muted-foreground">Target Project</span>
          <span className="font-medium text-foreground text-right">{project.name}</span>
          <span className="text-muted-foreground">Project ID</span>
          <span className="text-right"><Badge variant="secondary">{project.id}</Badge></span>
          <span className="text-muted-foreground">Total Rows</span>
          <span className="font-medium text-foreground text-right">{rows.length}</span>
          <span className="text-muted-foreground">New Records</span>
          <span className="font-medium text-emerald-600 dark:text-emerald-400 text-right">{mergeResult?.newRecords?.length ?? rows.length}</span>
          <span className="text-muted-foreground">Duplicates (will overwrite)</span>
          <span className="font-medium text-yellow-600 dark:text-yellow-400 text-right">{mergeResult?.duplicates?.length ?? 0}</span>
        </div>
      </div>

      {/* Confirmation checkbox */}
      <label className="flex items-start gap-3 cursor-pointer group">
        <Checkbox
          checked={confirmed}
          onCheckedChange={setConfirmed}
          className="mt-0.5"
        />
        <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
          I have reviewed the data and approve this import. I understand that duplicate records will be overwritten in the target project.
        </span>
      </label>

      <div className="flex flex-col sm:flex-row justify-between gap-2 pt-2">
        <Button variant="outline" onClick={onBack} disabled={status === 'loading'}>← Back</Button>
        <Button
          onClick={handleImport}
          disabled={!confirmed || status === 'loading'}
          className="gap-2 min-w-[140px]"
        >
          {status === 'loading' ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Importing…</>
          ) : (
            'Confirm Import'
          )}
        </Button>
      </div>
    </div>
  );
}