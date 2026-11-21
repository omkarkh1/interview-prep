import { cn } from '@/lib/utils';
import type { Dp1DStackHeapStep, Dp1DStackHeapVisualizer } from '@/types/curriculum';

const POINTER_TONE = {
  primary: 'bg-blue-500 text-white',
  emerald: 'bg-emerald-500 text-white',
  amber: 'bg-amber-500 text-slate-950',
  rose: 'bg-rose-500 text-white',
} as const;

interface Dp1DStackHeapRendererProps {
  spec: Dp1DStackHeapVisualizer;
  step: Dp1DStackHeapStep;
}

export function Dp1DStackHeapRenderer({ step }: Dp1DStackHeapRendererProps) {
  const depByIdx = new Map<number, string | undefined>();
  for (const d of step.primaryArray.dependencyIndices ?? []) {
    depByIdx.set(d.index, d.label);
  }

  const ptrsByIdx = new Map<number, NonNullable<Dp1DStackHeapStep['primaryArray']['pointers']>>();
  for (const p of step.primaryArray.pointers ?? []) {
    const list = ptrsByIdx.get(p.index) ?? [];
    list.push(p);
    ptrsByIdx.set(p.index, list);
  }

  return (
    <div className="space-y-4">
      {(step.recurrence || step.concreteFormula) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {step.recurrence && (
            <div className="rounded-lg border border-border bg-surface px-3.5 py-2.5">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Transition Rule
              </div>
              <div className="font-mono text-xs text-foreground">{step.recurrence}</div>
            </div>
          )}
          {step.concreteFormula && (
            <div className="rounded-lg border border-blue-500/30 bg-blue-500/8 px-3.5 py-2.5">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-300 mb-1">
                Step Computation
              </div>
              <div className="font-mono text-xs font-medium text-blue-800 dark:text-blue-200">
                {step.concreteFormula}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Optional Input Sequence */}
      {step.inputItems && (
        <div>
          <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {step.inputItems.label}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {step.inputItems.values.map((val, idx) => {
              const isActive = step.inputItems?.activeIndex === idx;
              const isDone =
                step.inputItems?.processedUntil !== undefined &&
                idx < step.inputItems.processedUntil;
              return (
                <div
                  key={idx}
                  className={cn(
                    'flex h-9 min-w-[40px] items-center justify-center rounded-md border px-2 font-mono text-xs font-semibold transition-all',
                    isActive
                      ? 'border-blue-500 bg-blue-500/18 text-blue-700 dark:text-blue-200 ring-2 ring-blue-500/20'
                      : isDone
                        ? 'border-border bg-surface/50 text-muted-foreground'
                        : 'border-border bg-card text-foreground',
                  )}
                >
                  {val}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Primary 1D DP Array / Tails Array */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {step.primaryArray.label}
          </span>
          <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-xs bg-blue-500" />
              Active
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-xs border border-amber-500 bg-amber-500/25" />
              Dependency
            </span>
          </div>
        </div>

        <div className="overflow-x-auto pb-2">
          <div className="inline-flex items-start gap-1.5 min-w-max">
            {step.primaryArray.values.map((val, idx) => {
              const isActive = step.primaryArray.activeIndex === idx;
              const isDep = depByIdx.has(idx);
              const depLabel = depByIdx.get(idx);
              const ptrs = ptrsByIdx.get(idx) ?? [];
              const indexLabel = step.primaryArray.indices?.[idx] ?? idx;

              return (
                <div key={idx} className="flex flex-col items-center min-w-[52px] shrink-0">
                  <span className="mb-1 font-mono text-[10px] text-muted-foreground">
                    [{indexLabel}]
                  </span>
                  <div
                    className={cn(
                      'flex h-12 min-w-[52px] flex-col items-center justify-center rounded-lg border px-2 font-mono text-sm font-semibold transition-all duration-200',
                      isActive
                        ? 'border-blue-500 bg-blue-500 text-white shadow-sm ring-2 ring-blue-500/30'
                        : isDep
                          ? 'border-amber-500 bg-amber-500/18 text-amber-800 dark:text-amber-200'
                          : val === '∞' || val === '·'
                            ? 'border-border/70 bg-surface/50 text-muted-foreground/65'
                            : 'border-border bg-card text-foreground',
                    )}
                  >
                    <span>{val}</span>
                    {depLabel && !isActive && (
                      <span className="text-[9px] font-medium opacity-85 leading-none mt-0.5">
                        {depLabel}
                      </span>
                    )}
                  </div>

                  {ptrs.length > 0 && (
                    <div className="mt-1.5 flex flex-col items-center gap-1">
                      {ptrs.map((ptr, pIdx) => (
                        <span
                          key={`${ptr.label}-${pIdx}`}
                          className={cn(
                            'rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold leading-none',
                            POINTER_TONE[ptr.tone ?? 'primary'],
                          )}
                        >
                          {ptr.label}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Optional Stack / Heap Secondary Container */}
      {step.secondaryContainer && (
        <div className="rounded-lg border border-border bg-surface p-3">
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {step.secondaryContainer.title}
          </div>
          {step.secondaryContainer.items.length === 0 ? (
            <div className="font-mono text-xs text-muted-foreground italic">[ empty ]</div>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {step.secondaryContainer.items.map((item, idx) => (
                <div
                  key={idx}
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 font-mono text-xs',
                    item.highlight
                      ? 'border-emerald-500/50 bg-emerald-500/15 text-emerald-700 dark:text-emerald-200 font-semibold'
                      : 'border-border bg-card text-foreground',
                  )}
                >
                  <span>{item.value}</span>
                  {item.meta && <span className="text-[10px] text-muted-foreground">{item.meta}</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
