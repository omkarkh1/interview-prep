import { ChevronLeft, ChevronRight, Pause, Play, RotateCcw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ArrayPointersRenderer } from '@/components/dsa/ArrayPointersRenderer';
import { Dp1DStackHeapRenderer } from '@/components/dsa/Dp1DStackHeapRenderer';
import { DpTable2DRenderer } from '@/components/dsa/DpTable2DRenderer';
import { TreeGraphRenderer } from '@/components/dsa/TreeGraphRenderer';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { AccentTone, DsaVisualizerSpec } from '@/types/curriculum';

const VARIABLE_TONES: Record<AccentTone, string> = {
  default: 'border-border bg-surface text-foreground',
  primary: 'border-blue-500/35 bg-blue-500/12 text-blue-700 dark:text-blue-200',
  emerald: 'border-emerald-500/35 bg-emerald-500/12 text-emerald-700 dark:text-emerald-200',
  amber: 'border-amber-500/35 bg-amber-500/12 text-amber-700 dark:text-amber-200',
  rose: 'border-rose-500/35 bg-rose-500/12 text-rose-700 dark:text-rose-200',
};

const SPEED_OPTIONS = [
  { label: '0.75x', ms: 2000 },
  { label: '1x', ms: 1350 },
  { label: '1.5x', ms: 850 },
] as const;

interface VisualStepperProps {
  spec: DsaVisualizerSpec;
}

export function VisualStepper({ spec }: VisualStepperProps) {
  const totalSteps = spec.steps.length;
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speedIdx, setSpeedIdx] = useState(1);

  // Auto-advance timer when playing
  useEffect(() => {
    if (!isPlaying) return;
    const timer = window.setTimeout(() => {
      setStepIndex((prev) => {
        const next = Math.min(prev + 1, totalSteps - 1);
        if (next >= totalSteps - 1) {
          setIsPlaying(false);
        }
        return next;
      });
    }, SPEED_OPTIONS[speedIdx].ms);
    return () => window.clearTimeout(timer);
  }, [isPlaying, stepIndex, totalSteps, speedIdx]);

  const currentStep = spec.steps[Math.min(stepIndex, totalSteps - 1)];

  const handlePrev = () => {
    setIsPlaying(false);
    setStepIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setIsPlaying(false);
    setStepIndex((prev) => Math.min(totalSteps - 1, prev + 1));
  };

  const handleReset = () => {
    setIsPlaying(false);
    setStepIndex(0);
  };

  const handleTogglePlay = () => {
    if (stepIndex >= totalSteps - 1) {
      setStepIndex(0);
      setIsPlaying(true);
    } else {
      setIsPlaying((prev) => !prev);
    }
  };

  return (
    <section
      className="rounded-xl border border-border bg-card overflow-hidden"
      aria-label="Interactive step-by-step dry run"
    >
      {/* Top header + concrete input badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-surface px-4 py-3">
        <div>
          <div className="text-xs font-semibold text-foreground">{spec.title}</div>
          <div className="mt-0.5 font-mono text-[11px] text-muted-foreground">
            Input: <span className="text-foreground">{spec.inputSummary}</span>
          </div>
        </div>

        {/* Transport Controls */}
        <div className="flex flex-wrap items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrev}
            disabled={stepIndex === 0}
            aria-label="Previous step"
            data-testid="stepper-prev"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            <span>Prev</span>
          </Button>
          <Button
            variant={isPlaying ? 'secondary' : 'default'}
            size="sm"
            onClick={handleTogglePlay}
            aria-label={isPlaying ? 'Pause playback' : 'Play dry run'}
            data-testid="stepper-play"
          >
            {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            <span>{isPlaying ? 'Pause' : stepIndex >= totalSteps - 1 ? 'Replay' : 'Play'}</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            disabled={stepIndex >= totalSteps - 1}
            aria-label="Next step"
            data-testid="stepper-next"
          >
            <span>Next</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            aria-label="Reset stepper"
            data-testid="stepper-reset"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </Button>

          <button
            type="button"
            onClick={() => setSpeedIdx((prev) => (prev + 1) % SPEED_OPTIONS.length)}
            className="ml-1 rounded-md border border-border bg-card px-2 py-1 font-mono text-[11px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            title="Toggle playback speed"
          >
            {SPEED_OPTIONS[speedIdx].label}
          </button>
        </div>
      </div>

      {/* Step progress scrubber */}
      <div className="flex items-center gap-3 border-b border-border bg-card px-4 py-2">
        <span
          className="font-mono text-[11px] font-medium text-muted-foreground shrink-0"
          data-testid="stepper-counter"
        >
          Step {stepIndex + 1} / {totalSteps}
        </span>
        <div className="flex flex-1 items-center gap-1" role="tablist" aria-label="Dry run steps">
          {spec.steps.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setIsPlaying(false);
                setStepIndex(idx);
              }}
              aria-label={`Go to step ${idx + 1}`}
              className={cn(
                'h-1.5 flex-1 rounded-full transition-all cursor-pointer',
                idx === stepIndex
                  ? 'bg-primary'
                  : idx < stepIndex
                    ? 'bg-primary/40 hover:bg-primary/60'
                    : 'bg-muted hover:bg-border-strong',
              )}
            />
          ))}
        </div>
      </div>

      {/* Visualizer Canvas */}
      <div className="p-4 sm:p-5">
        {spec.kind === 'array-pointers' && (
          <ArrayPointersRenderer spec={spec} step={spec.steps[Math.min(stepIndex, totalSteps - 1)]} />
        )}
        {spec.kind === 'dp-table-2d' && (
          <DpTable2DRenderer spec={spec} step={spec.steps[Math.min(stepIndex, totalSteps - 1)]} />
        )}
        {spec.kind === 'dp-1d-stack-heap' && (
          <Dp1DStackHeapRenderer spec={spec} step={spec.steps[Math.min(stepIndex, totalSteps - 1)]} />
        )}
        {spec.kind === 'tree-graph' && (
          <TreeGraphRenderer spec={spec} step={spec.steps[Math.min(stepIndex, totalSteps - 1)]} />
        )}
      </div>

      {/* Live Variables + Step Explanation Caption */}
      <div className="border-t border-border bg-surface/75 px-4 py-3.5 sm:px-5 space-y-3">
        {currentStep.variables.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {currentStep.variables.map((v, idx) => (
              <div
                key={`${v.name}-${idx}`}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 font-mono text-xs',
                  VARIABLE_TONES[v.tone ?? (v.highlight ? 'primary' : 'default')],
                )}
              >
                <span className="text-muted-foreground">{v.name} =</span>
                <span className="font-semibold">{v.value}</span>
              </div>
            ))}
          </div>
        )}

        <p className="text-sm leading-relaxed text-foreground" data-testid="stepper-caption">
          {currentStep.caption}
        </p>
      </div>
    </section>
  );
}
