import { useState, useRef } from 'react';
import { Upload, FileSpreadsheet, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SAMPLE_ROWS } from '@/lib/mockData';

export default function Step1FileSelect({ onNext }) {
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
    // In a real Electron app, this would parse the actual file.
    // For demo, we use mock data.
    onNext(SAMPLE_ROWS, { name: selectedFile?.name || 'SampleLineList.xlsx' });
  };

  return (
    <div className="flex flex-col items-center gap-6 max-w-xl mx-auto py-8">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-foreground">Select Excel File</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Import the first worksheet from your Heat Tracing Line List workbook.
        </p>
      </div>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          'w-full border-2 border-dashed rounded-xl p-10 flex flex-col items-center gap-3 cursor-pointer transition-all duration-150',
          dragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-accent/40'
        )}
      >
        <Upload className="w-10 h-10 text-muted-foreground" />
        <div className="text-center">
          <p className="font-medium text-foreground">Drop your Excel file here</p>
          <p className="text-xs text-muted-foreground mt-1">or click to browse — .xlsx, .xls, .csv</p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          className="hidden"
          onChange={(e) => handleFile(e.target.files[0])}
        />
      </div>

      {selectedFile && (
        <div className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-accent border border-border">
          <FileSpreadsheet className="w-5 h-5 text-primary shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{selectedFile.name}</p>
            <p className="text-xs text-muted-foreground">{(selectedFile.size / 1024).toFixed(1)} KB</p>
          </div>
        </div>
      )}

      {error && (
        <div className="w-full flex items-center gap-2 text-destructive text-sm px-3 py-2 rounded-lg bg-destructive/10 border border-destructive/20">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      <div className="flex gap-3 w-full">
        <Button
          onClick={handleLoadSample}
          disabled={!selectedFile}
          className="flex-1"
        >
          Import Worksheet
        </Button>
        <Button
          variant="outline"
          onClick={() => onNext(SAMPLE_ROWS, { name: 'Demo_LineList.xlsx' })}
          className="text-muted-foreground"
        >
          Load Demo
        </Button>
      </div>
    </div>
  );
}