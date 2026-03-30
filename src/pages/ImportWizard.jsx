import { useState } from 'react';
import { Layers, GitBranch, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import StepIndicator from '../components/wizard/StepIndicator';
import Step4SelectProject from '../components/wizard/Step4SelectProject';
import Step1FileSelect from '../components/wizard/Step1FileSelect';
import Step3Validate from '../components/wizard/Step3Validate';
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
      <header className="flex items-stretch sticky top-0 z-10" style={{ background: 'var(--thermon-black)', borderBottom: '3px solid var(--thermon-red)' }}>
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-4 py-2.5 border-r border-white/10">
          <div className="w-6 h-6 rounded flex items-center justify-center" style={{ background: 'var(--thermon-red)' }}>
            <Layers className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-xs text-white tracking-widest uppercase font-bold hidden sm:block" style={{ fontFamily: "'Oswald', sans-serif" }}>HeatTrace Import</span>
        </div>

        {/* Tab navigation */}
        <nav className="flex items-stretch flex-1">
          {[
            { icon: Layers, label: 'Projects', s: 1 },
            { icon: GitBranch, label: 'Circuits', s: 3 },
            { icon: Eye, label: 'Review', s: 5 },
          ].map(({ icon: Icon, label, s }) => {
            const active = step === s || (s === 1 && step <= 2) || (s === 3 && step === 4);
            return (
              <div key={label} className={`flex items-center gap-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors cursor-default ${
                active
                  ? 'border-white text-white bg-white/10'
                  : 'border-transparent text-white/50'
              }`}>
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{label}</span>
              </div>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3 px-4">
          {importResult && (
            <Link to={`/project/${project?.id}`} className="text-xs text-white/60 hover:text-white transition-colors">
              View Last Import →
            </Link>
          )}
          <ThemeToggle />
        </div>
      </header>

      {/* Step indicator */}
      <div className="border-b border-border bg-card/50">
        <StepIndicator currentStep={step} />
      </div>

      {/* Step content */}
      <main className={`flex-1 px-6 py-8 w-full ${step === 1 || step === 3 ? 'max-w-none' : 'max-w-5xl mx-auto'}`}>
        {step === 1 && (
          <Step4SelectProject
            onNext={(selectedProject) => {
              setProject(selectedProject);
              setStep(2);
            }}
            onBack={null}
          />
        )}
        {step === 2 && (
          <Step1FileSelect
            project={project}
            onNext={(parsedRows, info) => {
              setRows(parsedRows);
              setFileInfo(info);
              setStep(3);
            }}
            onBack={() => setStep(1)}
          />
        )}
        {step === 3 && (
          <Step3Validate
            rows={rows}
            fileInfo={fileInfo}
            project={project}
            onNext={() => setStep(4)}
            onBack={() => setStep(2)}
          />
        )}
        {step === 4 && (
          <Step5PreMerge
            rows={rows}
            project={project}
            fileInfo={fileInfo}
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
            fileInfo={fileInfo}
            mergeResult={mergeResult}
            onBack={() => setStep(4)}
            onImportDone={(result) => setImportResult(result)}
          />
        )}
      </main>
    </div>
  );
}