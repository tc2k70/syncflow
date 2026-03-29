import { useState, useRef } from 'react';
import { Upload, FileSpreadsheet, AlertCircle, Download, Info, CheckCircle2 } from 'lucide-react';
import WizardBreadcrumb from './WizardBreadcrumb';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SAMPLE_ROWS } from '@/lib/mockData';

const FILE_REQUIREMENTS = [
  'File must be in Excel format (.xlsx or .xls)',
  'First row must contain column headers matching the template',
  'Required columns: Circuit Name, Line Number, Temp. Control Type, Volts, Pipe Len.',
  'File size must not exceed 10MB',
  'Data should be in rows starting from row 2 (after headers)',
];

export default function Step1FileSelect({ onNext, onBack, project }) {
  const [dragging, setDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);
  const inputRef = useRef();

  const handleFile = (file) => {
    if (!file) return;
    const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.name.endsWith('.csv');
    if (!isExcel) {
      setError('Please select a valid Excel file (.xlsx, .xls) or CSV.');
      return;
    }
    setError(null);
    setSelectedFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleLoadSample = () => {
    onNext(SAMPLE_ROWS, { name: selectedFile?.name || 'SampleLineList.xlsx' });
  };

  return (
    <div className="flex flex-col gap-5 w-full max-w-2xl mx-auto">
      {project && <WizardBreadcrumb project={project} />}
      <div>
        <h2 className="text-2xl font-semibold text-foreground">Upload Circuit Line List</h2>
        <p className="text-sm text-muted-foreground mt-1">Upload an Excel file containing your circuit data for validation</p>
      </div>

      {/* Before You Upload banner */}
      <div className="flex items-start gap-3 px-4 py-3 rounded-lg border border-primary/40 bg-primary/5">
        <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-primary">Before You Upload</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Make sure your Excel file follows the template format with all required columns. Download the template below if you haven't already.
          </p>
        </div>
      </div>

      {/* Need the Template? */}
      <div className="flex items-start gap-4 px-4 py-4 rounded-lg border border-border bg-card">
        <FileSpreadsheet className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground">Need the Template?</p>
          <p className="text-xs text-muted-foreground mt-0.5">Download our Excel template to ensure your data is properly formatted with all required columns and headers.</p>
          <Button size="sm" className="mt-3 gap-2">
            <Download className="w-3.5 h-3.5" /> Download Excel Template
          </Button>
        </div>
      </div>

      {/* Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={cn(
          'w-full border-2 border-dashed rounded-xl py-12 flex flex-col items-center gap-3 transition-all duration-150',
          dragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-accent/20'
        )}
      >
        <Upload className="w-10 h-10 text-muted-foreground" />
        <div className="text-center">
          <p className="font-medium text-foreground">Drag and drop your file here</p>
          <p className="text-sm text-muted-foreground mt-1">or</p>
        </div>
        <Button onClick={() => inputRef.current?.click()} className="gap-2 px-6">
          Browse Files
        </Button>
        <p className="text-xs text-muted-foreground">Supported formats: .xlsx, .xls (Max size: 10MB)</p>
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          className="hidden"
          onChange={(e) => handleFile(e.target.files[0])}
        />
      </div>

      {selectedFile && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{selectedFile.name}</p>
            <p className="text-xs text-muted-foreground">{(selectedFile.size / 1024).toFixed(1)} KB</p>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-destructive text-sm px-3 py-2 rounded-lg bg-destructive/10 border border-destructive/20">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* File Requirements */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-foreground">File Requirements</p>
        {FILE_REQUIREMENTS.map((req, i) => (
          <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
            {req}
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2 pt-2 border-t border-border">
        <Button variant="outline" onClick={onBack} disabled={!onBack}>← Back</Button>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => onNext(SAMPLE_ROWS, { name: 'Demo_LineList.xlsx' })}>
            Load Demo
          </Button>
          <Button onClick={handleLoadSample} disabled={!selectedFile}>
            Continue to Validation →
          </Button>
        </div>
      </div>
    </div>
  );
}