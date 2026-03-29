import { useState } from 'react';
import { AlertTriangle, CheckCircle2, ChevronDown, ChevronRight, Folder, Lightbulb } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// Map field names to human-readable error group titles and fix suggestions
const ERROR_META = {
  volts: {
    title: 'Invalid Voltage Value',
    fix: (fileInfo) =>
      `1. Open your Excel file: ${fileInfo?.name || 'your file'}\n2. Navigate to the affected rows\n3. Correct the Volts field to one of: 120, 240, 480, 600\n4. Save and re-upload the file`,
  },
  maintTemp: {
    title: 'Invalid Maintenance Temperature',
    fix: (fileInfo) =>
      `1. Open your Excel file: ${fileInfo?.name || 'your file'}\n2. Navigate to the affected rows\n3. Ensure Maint. Temp. is a valid number (e.g. 50, 75, 120)\n4. Save and re-upload the file`,
  },
  circuitName: {
    title: 'Missing Circuit Name',
    fix: (fileInfo) =>
      `1. Open your Excel file: ${fileInfo?.name || 'your file'}\n2. Navigate to the affected rows\n3. Fill in the Circuit Name column\n4. Save and re-upload the file`,
  },
  lineNumber: {
    title: 'Missing Line Number',
    fix: (fileInfo) =>
      `1. Open your Excel file: ${fileInfo?.name || 'your file'}\n2. Navigate to the affected rows\n3. Fill in the Line Number column\n4. Save and re-upload the file`,
  },
  pipeLen: {
    title: 'Invalid Pipe Length',
    fix: (fileInfo) =>
      `1. Open your Excel file: ${fileInfo?.name || 'your file'}\n2. Navigate to the affected rows\n3. Ensure Pipe Len. is a valid number\n4. Save and re-upload the file`,
  },
};

function getErrorMeta(field) {
  return ERROR_META[field] || {
    title: `Invalid ${field}`,
    fix: (fileInfo) => `1. Open your Excel file: ${fileInfo?.name || 'your file'}\n2. Navigate to the affected rows\n3. Correct the ${field} field\n4. Save and re-upload the file`,
  };
}

// ── Detail Panel ─────────────────────────────────────────────────────────────
function CircuitDetail({ row, rowIdx, errors }) {
  const rowNum = rowIdx + 1;
  const rowErrors = errors.filter(e => e.row === rowNum);
  const hasError = rowErrors.length > 0;

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className={cn('w-10 h-10 rounded-full flex items-center justify-center shrink-0', hasError ? 'bg-destructive/10' : 'bg-emerald-100 dark:bg-emerald-950/40')}>
          {hasError
            ? <AlertTriangle className="w-5 h-5 text-destructive" />
            : <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-bold text-foreground uppercase tracking-wide">{row.circuitName || `Row ${rowNum}`}</h3>
            <Badge variant={hasError ? 'destructive' : 'secondary'} className={cn('text-xs shrink-0', !hasError && 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200')}>
              {hasError ? 'Has Errors' : 'Valid'}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">Connection: {row.lineNumber} | Row: {rowNum}</p>
        </div>
      </div>

      {/* Basic Information */}
      <section>
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Basic Information</p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Circuit Name', value: row.circuitName },
            { label: 'Line Number', value: row.lineNumber },
            { label: 'Temp. Control Type', value: row.tempControlType },
            { label: 'Circuit Configuration', value: row.circuitConfiguration },
          ].map(({ label, value }) => (
            <div key={label} className="p-3 rounded-lg bg-muted/40 border border-border">
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="text-sm font-semibold text-foreground mt-0.5">{value ?? '—'}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Electrical Properties */}
      <section>
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Electrical Properties</p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Volts', value: row.volts },
            { label: 'Breaker Size', value: row.breakerSize },
            { label: 'Breaker Type', value: row.breakerType },
            { label: 'Pipe Length', value: row.pipeLen ? `${row.pipeLen} ft` : undefined },
          ].map(({ label, value }) => (
            <div key={label} className="p-3 rounded-lg bg-muted/40 border border-border">
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="text-sm font-semibold text-foreground mt-0.5">{value ?? '—'}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Validation Errors */}
      {hasError && rowErrors.map((err, i) => {
        const meta = getErrorMeta(err.field);
        return (
          <section key={i} className="flex flex-col gap-2">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Validation Error</p>
            <div className="rounded-lg border-l-4 border-l-destructive border border-destructive/20 bg-destructive/5 p-3">
              <p className="text-sm font-semibold text-destructive">{meta.title}</p>
              <p className="text-xs text-muted-foreground mt-1">{err.message}</p>
            </div>
            <div className="rounded-lg border-l-4 border-l-blue-400 border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20 p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <Lightbulb className="w-3.5 h-3.5 text-blue-500" />
                <p className="text-xs font-semibold text-blue-700 dark:text-blue-300">Suggested Fix</p>
              </div>
              <p className="text-xs text-blue-700 dark:text-blue-300 whitespace-pre-line">{meta.fix({ name: 'your file' })}</p>
            </div>
          </section>
        );
      })}
    </div>
  );
}

function ErrorGroupDetail({ field, affectedItems, fileInfo }) {
  const meta = getErrorMeta(field);
  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-950/40 flex items-center justify-center shrink-0">
          <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground uppercase tracking-wide">{meta.title}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{affectedItems.length} circuit{affectedItems.length !== 1 ? 's' : ''} affected</p>
        </div>
      </div>

      {/* Common Error Pattern */}
      <div className="rounded-lg border-l-4 border-l-destructive border border-destructive/20 bg-destructive/5 p-3">
        <p className="text-sm font-semibold text-destructive mb-1">Common Error Pattern</p>
        <p className="text-xs text-muted-foreground">This error affects {affectedItems.length} circuit{affectedItems.length !== 1 ? 's' : ''} in your import file. Review each affected circuit in the tree to see specific details.</p>
      </div>

      {/* Affected circuits */}
      <section>
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Affected Circuits</p>
        <div className="flex flex-wrap gap-2">
          {affectedItems.map(({ row, rowIdx }) => (
            <span key={rowIdx} className="px-2.5 py-1 rounded-full border border-border bg-muted text-xs font-medium text-foreground">
              {row.circuitName || `Row ${rowIdx + 1}`} (Row {rowIdx + 1})
            </span>
          ))}
        </div>
      </section>

      {/* How to Fix */}
      <div className="rounded-lg border-l-4 border-l-blue-400 border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20 p-3">
        <div className="flex items-center gap-1.5 mb-1">
          <Lightbulb className="w-3.5 h-3.5 text-blue-500" />
          <p className="text-xs font-semibold text-blue-700 dark:text-blue-300">How to Fix</p>
        </div>
        <p className="text-xs text-blue-700 dark:text-blue-300 whitespace-pre-line">{meta.fix(fileInfo)}</p>
      </div>
    </div>
  );
}

function EmptyDetail() {
  return (
    <div className="flex flex-col items-center justify-center h-full py-16 text-center gap-3">
      <Folder className="w-10 h-10 text-muted-foreground/30" />
      <p className="text-sm text-muted-foreground">Select a circuit or error group to view details</p>
    </div>
  );
}

// ── Tree Node ────────────────────────────────────────────────────────────────
function TreeItem({ icon, label, count, countColor, isSelected, onClick, rowBadge, indent = 0, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const hasChildren = !!children;

  return (
    <div>
      <div
        className={cn(
          'flex items-center gap-1.5 py-1.5 px-2 rounded-md cursor-pointer text-xs transition-colors select-none',
          isSelected ? 'bg-primary/10 border-l-2 border-l-primary' : 'hover:bg-accent/50',
        )}
        style={{ paddingLeft: `${8 + indent * 16}px` }}
        onClick={() => { onClick?.(); if (hasChildren) setOpen(o => !o); }}
      >
        {hasChildren ? (
          open ? <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
        ) : (
          <span className="w-3.5 shrink-0" />
        )}
        {icon}
        <span className="flex-1 font-medium text-foreground truncate">{label}</span>
        {rowBadge !== undefined && <span className="text-muted-foreground text-xs shrink-0">Row {rowBadge}</span>}
        {count !== undefined && (
          <span className={cn('text-xs font-bold shrink-0', countColor || 'text-muted-foreground')}>{count}</span>
        )}
      </div>
      {hasChildren && open && <div>{children}</div>}
    </div>
  );
}

// ── Main TreeViewDetail ──────────────────────────────────────────────────────
export default function TreeViewDetail({ rows, result, fileInfo }) {
  const [selected, setSelected] = useState(null);
  // selected: null | { type: 'circuit', rowIdx } | { type: 'errorGroup', field }

  if (!result) return null;

  // Group errors by field
  const errorsByField = {};
  result.errors.forEach(err => {
    if (!errorsByField[err.field]) errorsByField[err.field] = [];
    errorsByField[err.field].push(err);
  });

  const errorRowIdxSet = new Set(result.errors.map(e => e.row - 1));
  const validRows = rows.map((r, i) => ({ r, i })).filter(({ i }) => !errorRowIdxSet.has(i));

  // Render detail
  let detail = <EmptyDetail />;
  if (selected?.type === 'circuit') {
    const row = rows[selected.rowIdx];
    detail = <CircuitDetail row={row} rowIdx={selected.rowIdx} errors={result.errors} />;
  } else if (selected?.type === 'errorGroup') {
    const field = selected.field;
    const errRows = errorsByField[field];
    const affectedItems = errRows.map(e => ({ row: rows[e.row - 1], rowIdx: e.row - 1 }));
    detail = <ErrorGroupDetail field={field} affectedItems={affectedItems} fileInfo={fileInfo} />;
  }

  return (
    <div className="flex gap-4 border border-border rounded-lg overflow-hidden min-h-[400px]">
      {/* Left tree */}
      <div className="w-64 shrink-0 border-r border-border bg-card overflow-y-auto py-2">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-3 py-2">Validation Results</p>

        {/* Circuits with Errors */}
        <TreeItem
          icon={<Folder className="w-3.5 h-3.5 text-yellow-500 shrink-0" />}
          label="Circuits with Errors"
          count={result.errors.length > 0 ? Object.values(errorsByField).length > 1 ? errorRowIdxSet.size : result.errors.length : 0}
          countColor="text-destructive"
          defaultOpen={true}
          indent={0}
        >
          {Object.entries(errorsByField).map(([field, errs]) => {
            const isGroupSelected = selected?.type === 'errorGroup' && selected.field === field;
            return (
              <TreeItem
                key={field}
                icon={<AlertTriangle className="w-3 h-3 text-yellow-500 shrink-0" />}
                label={getErrorMeta(field).title}
                count={errs.length}
                countColor="text-destructive"
                isSelected={isGroupSelected}
                onClick={() => setSelected({ type: 'errorGroup', field })}
                indent={1}
                defaultOpen={true}
              >
                {errs.map(err => {
                  const rowIdx = err.row - 1;
                  const row = rows[rowIdx];
                  const isCircuitSelected = selected?.type === 'circuit' && selected.rowIdx === rowIdx;
                  return (
                    <TreeItem
                      key={rowIdx}
                      icon={<span className="w-3 h-3 rounded-full bg-destructive shrink-0 inline-block" />}
                      label={row?.circuitName || `Row ${err.row}`}
                      rowBadge={err.row}
                      isSelected={isCircuitSelected}
                      onClick={() => setSelected({ type: 'circuit', rowIdx })}
                      indent={2}
                    />
                  );
                })}
              </TreeItem>
            );
          })}
        </TreeItem>

        {/* Valid Circuits */}
        <TreeItem
          icon={<Folder className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
          label="Valid Circuits"
          count={validRows.length}
          countColor="text-emerald-600"
          defaultOpen={true}
          indent={0}
        >
          {validRows.map(({ r, i }) => {
            const isCircuitSelected = selected?.type === 'circuit' && selected.rowIdx === i;
            return (
              <TreeItem
                key={i}
                icon={<CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />}
                label={r.circuitName || `Row ${i + 1}`}
                rowBadge={i + 1}
                isSelected={isCircuitSelected}
                onClick={() => setSelected({ type: 'circuit', rowIdx: i })}
                indent={1}
              />
            );
          })}
        </TreeItem>
      </div>

      {/* Right detail */}
      <div className="flex-1 p-5 overflow-y-auto">
        {detail}
      </div>
    </div>
  );
}