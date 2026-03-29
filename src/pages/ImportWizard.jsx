import { useState } from 'react';
import { FileSpreadsheet } from 'lucide-react';
import { Link } from 'react-router-dom';
import StepIndicator from '../components/wizard/StepIndicator';
import Step1FileSelect from '../components/wizard/Step1FileSelect';
import Step3Validate from '../components/wizard/Step3Validate';
import Step4SelectProject from '../components/wizard/Step4SelectProject';
import Step5PreMerge from '../components/wizard/Step5PreMerge';
import Step6ApproveImport from '../components/wizard/Step6ApproveImport';
import ThemeToggle from '../components/ThemeToggle';

export default function ImportWizard() {
  const [step, setStep] = useState(1);
  const [rows, setRows] = useState([]);
  const [fileInfo, setFileInfo] = useState(null);
  const [project, setProject] = useState(null);
  const [mergeResult, setMergeResult] = useState(null);
  const [importResult, setImportResult] = useState(null);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="px-6 py-3 flex items-center justify-between sticky top-0 z-10" style={{ background: 'var(--thermon-black)', borderBottom: '3px solid var(--thermon-red)' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded flex items-center justify-center" style={{ background: 'var(--thermon-red)' }}>
            <FileSpreadsheet className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm text-white tracking-widest uppercase font-bold" style={{ fontFamily: "'Oswald', sans-serif" }}>HeatTrace Import</span>
        </div>
        <div className="flex items-center gap-3">
          {importResult && (
            <Link to={`/project/${project?.id}`} className="text-xs text-white/60 hover:text-white transition-colors">
              View Last Import →
            </Link>
          )}
          <ThemeToggle />
        </div>
      </header>

      {/* Step indicator */}
      <div className="border-b border-border bg-card/30">
        <StepIndicator currentStep={step} />
      </div>

      {/* Step content */}
      <main className="flex-1 px-6 py-8 max-w-5xl mx-auto w-full">
        {step === 1 && (
          <Step1FileSelect
            onNext={(parsedRows, info) => {
              setRows(parsedRows);
              setFileInfo(info);
              setStep(2);
            }}
          />
        )}
        {step === 2 && (
          <Step3Validate
            rows={rows}
            fileInfo={fileInfo}
            onNext={() => setStep(3)}
            onBack={() => setStep(1)}
          />
        )}
        {step === 3 && (
          <Step4SelectProject
            onNext={(selectedProject) => {
              setProject(selectedProject);
              setStep(4);
            }}
            onBack={() => setStep(2)}
          />
        )}
        {step === 4 && (
          <Step5PreMerge
            rows={rows}
            project={project}
            onNext={(result) => {
              setMergeResult(result);
              setStep(5);
            }}
            onBack={() => setStep(3)}
          />
        )}
        {step === 5 && (
          <Step6ApproveImport
            rows={rows}
            project={project}
            mergeResult={mergeResult}
            onBack={() => setStep(4)}
            onImportDone={(result) => setImportResult(result)}
          />
        )}
      </main>
    </div>
  );
}