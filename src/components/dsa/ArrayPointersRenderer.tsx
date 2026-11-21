import { cn } from '@/lib/utils';
import type { ArrayPointersStep, ArrayPointersVisualizer } from '@/types/curriculum';

const POINTER_TONE = {
  primary: 'bg-blue-500 text-white border-blue-400',
  emerald: 'bg-emerald-500 text-white border-emerald-400',
  amber: 'bg-amber-500 text-slate-950 border-amber-400',
  rose: 'bg-rose-500 text-white border-rose-400',
} as const;

const WINDOW_TONE = {
  primary: 'border-blue-500/50 bg-blue-500/8 text-blue-700 dark:text-blue-300',
  emerald: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
  amber: 'border-amber-500/50 bg-amber-500/10 text-amber-700 dark:text-amber-300',
  rose: 'border-rose-500/50 bg-rose-500/10 text-rose-700 dark:text-rose-300',
} as const;

const AUX_TONE = {
  primary: 'border-blue-500/45 bg-blue-500/12 text-blue-700 dark:text-blue-300',
  emerald: 'border-emerald-500/45 bg-emerald-500/12 text-emerald-700 dark:text-emerald-300',
  amber: 'border-amber-500/45 bg-amber-500/12 text-amber-700 dark:text-amber-300',
  rose: 'border-rose-500/45 bg-rose-500/12 text-rose-700 dark:text-rose-300',
} as const;

interface ArrayPointersRendererProps {
  spec: ArrayPointersVisualizer;
  step: ArrayPointersStep;
}

export function ArrayPointersRenderer({ step }: ArrayPointersRendererProps) {
  const pointersByIndex = new Map<number, typeof step.pointers>();
  for (const p of step.pointers) {
    const existing = pointersByIndex.get(p.index) ?? [];
    existing.push(p);
    pointersByIndex.set(p.index, existing);
  }

  return (
    <div className="space-y-4">
      {step.formula && (
        <div className="rounded-lg border border-border bg-surface px-3.5 py-2 font-mono text-xs text-foreground">
          <span className="text-muted-foreground mr-2 select-none">Invariant / Eval:</span>
          <span className="text-blue-600 dark:text-blue-300 font-medium">{step.formula}</span>
        </div>
      )}

      {/* Optional Elevation / Water Bar Mode */}
      {step.barMode ? (
        <div className="overflow-x-auto pb-2">
          <div className="inline-flex min-w-full flex-col items-center">
            <div className="relative flex items-end gap-1.5 sm:gap-2 px-3 pt-6 pb-2 border-b border-border-strong">
              {step.values.map((rawVal, idx) => {
                const heightVal = typeof rawVal === 'number' ? rawVal : Number(rawVal) || 0;
                const maxH = Math.max(step.barMode?.maxHeight ?? 1, 1);
                const maxPx = 148;
                const barPx = Math.round((heightVal / maxH) * maxPx);
                const waterVal = step.barMode?.waterLevels?.[idx] ?? 0;
                const waterPx = Math.round((waterVal / maxH) * maxPx);
                const shaded = step.barMode?.shadedSpan;
                const inShaded = shaded && idx >= shaded.start && idx <= shaded.end;
                const shadedPx = inShaded ? Math.round((shaded.height / maxH) * maxPx) : 0;
                const state = step.cellStates?.[idx];
                const isPointerHere = pointersByIndex.has(idx);

                return (
                  <div key={idx} className="flex flex-col items-center w-10 sm:w-12 shrink-0">
                    <div
                      className="relative flex items-end justify-center w-full"
                      style={{ height: `${maxPx + 22}px` }}
                    >
                      {/* Shaded Container Water Area (Container With Most Water) */}
                      {inShaded && shadedPx > 0 && (
                        <div
                          className="absolute bottom-0 inset-x-0 bg-blue-500/18 border-t border-dashed border-blue-400/70 transition-all duration-300"
                          style={{ height: `${shadedPx}px` }}
                        />
                      )}

                      {/* Trapped Water Column above bar (Trapping Rain Water) */}
                      {waterPx > 0 && (
                        <div
                          className="absolute w-7 sm:w-8 rounded-t-xs bg-sky-400/40 dark:bg-sky-400/35 border border-sky-400/60 transition-all duration-300 flex items-center justify-center"
                          style={{
                            bottom: `${barPx}px`,
                            height: `${waterPx}px`,
                          }}
                        >
                          {waterPx >= 18 && (
                            <span className="font-mono text-[10px] font-semibold text-sky-900 dark:text-sky-200">
                              +{waterVal}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Solid Elevation Pillar */}
                      <div
                        className={cn(
                          'relative z-10 w-7 sm:w-8 rounded-t transition-all duration-300 flex items-start justify-center pt-1',
                          state === 'active' || isPointerHere
                            ? 'bg-blue-500 text-white shadow-sm'
                            : state === 'best' || state === 'match'
                              ? 'bg-emerald-500/85 text-white'
                              : state === 'excluded'
                                ? 'bg-muted-foreground/25 text-muted-foreground'
                                : 'bg-slate-600/80 dark:bg-slate-500/70 text-white',
                        )}
                        style={{ height: `${Math.max(barPx, 4)}px` }}
                      >
                        {barPx >= 20 && (
                          <span className="font-mono text-[10px] font-semibold">{heightVal}</span>
                        )}
                      </div>
                      {barPx < 20 && (
                        <span
                          className="absolute font-mono text-[10px] font-medium text-muted-foreground"
                          style={{ bottom: `${Math.max(barPx + waterPx, 6) + 4}px` }}
                        >
                          {heightVal}
                        </span>
                      )}
                    </div>

                    {/* Index label */}
                    <span className="mt-1.5 font-mono text-[10px] text-muted-foreground">[{idx}]</span>

                    {/* Pointer tags below */}
                    <div className="mt-1.5 flex flex-col items-center gap-1 min-h-[24px]">
                      {(pointersByIndex.get(idx) ?? []).map((ptr, pIdx) => (
                        <span
                          key={`${ptr.label}-${pIdx}`}
                          className={cn(
                            'rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold leading-none border shadow-2xs',
                            POINTER_TONE[ptr.tone ?? 'primary'],
                          )}
                        >
                          {ptr.label}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Standard 1D Array / String Cells with Window Span & Pointer Badges */
        <div className="overflow-x-auto pb-2">
          <div className="inline-flex flex-col gap-2 min-w-max px-1">
            {/* Window indicator strip */}
            {step.windowRange && (
              <div className="flex items-center gap-2 text-[11px] font-mono">
                <span
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 font-medium',
                    WINDOW_TONE[step.windowRange.tone ?? 'primary'],
                  )}
                >
                  <span>{step.windowRange.label ?? 'Active Window'}</span>
                  <span>
                    [{step.windowRange.start}..{step.windowRange.end}]
                  </span>
                </span>
              </div>
            )}

            <div className="flex items-start gap-1.5 sm:gap-2">
              {step.values.map((val, idx) => {
                const inWindow =
                  step.windowRange &&
                  idx >= step.windowRange.start &&
                  idx <= step.windowRange.end;
                const state = step.cellStates?.[idx];
                const ptrs = pointersByIndex.get(idx) ?? [];

                return (
                  <div key={idx} className="flex flex-col items-center w-11 sm:w-12 shrink-0">
                    <span className="mb-1 font-mono text-[10px] text-muted-foreground">{idx}</span>
                    <div
                      className={cn(
                        'flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-lg border font-mono text-sm font-semibold transition-all duration-200',
                        state === 'active'
                          ? 'border-blue-500 bg-blue-500/18 text-blue-700 dark:text-blue-200 ring-2 ring-blue-500/25'
                          : state === 'match' || state === 'best'
                            ? 'border-emerald-500 bg-emerald-500/16 text-emerald-700 dark:text-emerald-200'
                            : state === 'dependency'
                              ? 'border-amber-500 bg-amber-500/16 text-amber-800 dark:text-amber-200'
                              : state === 'excluded'
                                ? 'border-rose-500/50 bg-rose-500/12 text-rose-700 dark:text-rose-300 line-through opacity-75'
                                : inWindow
                                  ? step.windowRange?.tone === 'emerald'
                                    ? 'border-emerald-500/55 bg-emerald-500/10 text-foreground'
                                    : step.windowRange?.tone === 'amber'
                                      ? 'border-amber-500/55 bg-amber-500/10 text-foreground'
                                      : step.windowRange?.tone === 'rose'
                                        ? 'border-rose-500/55 bg-rose-500/10 text-foreground'
                                        : 'border-blue-500/55 bg-blue-500/10 text-foreground'
                                  : 'border-border bg-surface text-foreground/85',
                      )}
                    >
                      {val}
                    </div>
                    <div className="mt-1.5 flex flex-col items-center gap-1 min-h-[24px]">
                      {ptrs.map((ptr, pIdx) => (
                        <span
                          key={`${ptr.label}-${pIdx}`}
                          className={cn(
                            'rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold leading-none border',
                            POINTER_TONE[ptr.tone ?? 'primary'],
                          )}
                        >
                          {ptr.label}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Auxiliary Data Structure (HashMap / Frequency Counter / Prefix Sum Map) */}
      {step.auxStructure && (
        <div className="rounded-lg border border-border bg-surface/80 p-3">
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {step.auxStructure.title}
          </div>
          {step.auxStructure.entries.length === 0 ? (
            <div className="font-mono text-xs text-muted-foreground italic">{'{ empty }'}</div>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {step.auxStructure.entries.map((entry, idx) => (
                <div
                  key={`${entry.key}-${idx}`}
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-md border px-2 py-1 font-mono text-xs transition-colors',
                    entry.highlight
                      ? AUX_TONE[entry.tone ?? 'primary']
                      : 'border-border bg-card text-foreground',
                  )}
                >
                  <span className="font-semibold">{entry.key}</span>
                  <span className="text-muted-foreground">→</span>
                  <span>{entry.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
