import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const STEPS = [
  { number: 1, label: 'Select Project' },
  { number: 2, label: 'Select File' },
  { number: 3, label: 'Validate' },
  { number: 4, label: 'Pre-Merge Check' },
  { number: 5, label: 'Approve & Import' },
];

export default function StepIndicator({ currentStep }) {
  return (
    <div className="flex items-center w-full px-4 py-0 overflow-x-auto">
      {STEPS.map((step, idx) => {
        const isCompleted = currentStep > step.number;
        const isActive = currentStep === step.number;
        return (
          <div key={step.number} className="flex items-center">
            <div className={cn(
              'flex items-center gap-2 px-3 py-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors',
              isActive    && 'border-primary text-primary',
              isCompleted && 'border-primary/40 text-muted-foreground',
              !isActive && !isCompleted && 'border-transparent text-muted-foreground/50'
            )}>
              <div className={cn(
                'w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border shrink-0',
                isCompleted && 'bg-primary border-primary text-primary-foreground',
                isActive    && 'border-primary text-primary bg-transparent',
                !isCompleted && !isActive && 'border-muted-foreground/30 text-muted-foreground/40'
              )}>
                {isCompleted ? <Check className="w-3 h-3" /> : step.number}
              </div>
              {step.label}
            </div>
            {idx < STEPS.length - 1 && (
              <div className={cn(
                'w-6 h-px mx-0.5',
                currentStep > step.number ? 'bg-primary/40' : 'bg-border'
              )} />
            )}
          </div>
        );
      })}
    </div>
  );
}