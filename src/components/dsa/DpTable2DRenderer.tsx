import { cn } from '@/lib/utils';
import type { DpCellCoord, DpTable2DStep, DpTable2DVisualizer } from '@/types/curriculum';

const DEP_CELL_STYLES = {
  amber: 'border-amber-500/80 bg-amber-500/16 text-amber-800 dark:text-amber-200',
  emerald: 'border-emerald-500/80 bg-emerald-500/16 text-emerald-800 dark:text-emerald-200',
  rose: 'border-rose-500/80 bg-rose-500/16 text-rose-800 dark:text-rose-200',
  primary: 'border-blue-500/80 bg-blue-500/16 text-blue-800 dark:text-blue-200',
} as const;

const DEP_BADGE_STYLES = {
  amber: 'bg-amber-500/20 text-amber-800 dark:text-amber-300',
  emerald: 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-300',
  rose: 'bg-rose-500/20 text-rose-800 dark:text-rose-300',
  primary: 'bg-blue-500/20 text-blue-800 dark:text-blue-300',
} as const;

interface DpTable2DRendererProps {
  spec: DpTable2DVisualizer;
  step: DpTable2DStep;
}

export function DpTable2DRenderer({ spec, step }: DpTable2DRendererProps) {
  const depMap = new Map<string, DpCellCoord>();
  for (const dep of step.dependencyCells ?? []) {
    depMap.set(`${dep.row}:${dep.col}`, dep);
  }

  const pathSet = new Set<string>();
  for (const cell of step.pathCells ?? []) {
    pathSet.add(`${cell.row}:${cell.col}`);
  }

  return (
    <div className="space-y-4">
      {/* Recurrence & Concrete Evaluation Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
        <div className="rounded-lg border border-border bg-surface px-3.5 py-2.5">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            Recurrence Relation
          </div>
          <div className="font-mono text-xs text-foreground leading-relaxed">{step.recurrence}</div>
        </div>
        <div className="rounded-lg border border-blue-500/30 bg-blue-500/8 px-3.5 py-2.5">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-300 mb-1">
            Current Evaluation
          </div>
          <div className="font-mono text-xs font-medium text-blue-800 dark:text-blue-200 leading-relaxed">
            {step.concreteFormula}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-xs border border-blue-500 bg-blue-500/25" />
          <span>Active Cell dp[i][j]</span>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-xs border border-amber-500 bg-amber-500/20" />
          <span>Dependency Cell(s)</span>
        </span>
        {pathSet.size > 0 && (
          <span className="inline-flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-xs border border-emerald-500 bg-emerald-500/25" />
            <span>Optimal Path</span>
          </span>
        )}
      </div>

      {/* 2D DP Grid */}
      <div className="overflow-x-auto pb-1">
        <table className="border-separate border-spacing-1.5 mx-auto">
          <thead>
            <tr>
              <th className="px-2.5 py-1.5 text-left font-mono text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                {spec.rowAxisLabel} \ {spec.colAxisLabel}
              </th>
              {spec.colHeaders.map((colLabel, colIdx) => {
                const isColActive = step.activeCell?.col === colIdx;
                return (
                  <th
                    key={colIdx}
                    className={cn(
                      'min-w-[54px] rounded-md px-2 py-1.5 font-mono text-xs font-semibold text-center transition-colors',
                      isColActive
                        ? 'bg-blue-500/15 text-blue-700 dark:text-blue-300'
                        : 'bg-surface text-muted-foreground',
                    )}
                  >
                    <div>{colLabel}</div>
                    <div className="text-[9px] font-normal opacity-65">j={colIdx}</div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {step.grid.map((rowValues, rowIdx) => {
              const isRowActive = step.activeCell?.row === rowIdx;
              return (
                <tr key={rowIdx}>
                  <th
                    className={cn(
                      'rounded-md px-2.5 py-1.5 font-mono text-xs font-semibold text-left whitespace-nowrap transition-colors',
                      isRowActive
                        ? 'bg-blue-500/15 text-blue-700 dark:text-blue-300'
                        : 'bg-surface text-muted-foreground',
                    )}
                  >
                    <span>{spec.rowHeaders[rowIdx]}</span>
                    <span className="ml-1.5 text-[9px] font-normal opacity-65">i={rowIdx}</span>
                  </th>
                  {rowValues.map((cellValue, colIdx) => {
                    const key = `${rowIdx}:${colIdx}`;
                    const isActive =
                      step.activeCell?.row === rowIdx && step.activeCell?.col === colIdx;
                    const dep = depMap.get(key);
                    const inPath = pathSet.has(key);
                    const isEmpty = cellValue === null || cellValue === '';

                    return (
                      <td
                        key={colIdx}
                        className={cn(
                          'relative h-12 min-w-[56px] rounded-lg border text-center align-middle font-mono transition-all duration-200 px-1.5',
                          isActive
                            ? 'border-blue-500 bg-blue-500 text-white shadow-sm ring-2 ring-blue-500/30 font-bold'
                            : dep
                              ? DEP_CELL_STYLES[dep.tone ?? 'amber']
                              : inPath
                                ? 'border-emerald-500/75 bg-emerald-500/18 text-emerald-700 dark:text-emerald-200 font-semibold'
                                : isEmpty
                                  ? 'border-border/60 bg-surface/40 text-muted-foreground/35'
                                  : 'border-border bg-card text-foreground font-medium',
                        )}
                      >
                        <div className="text-sm leading-none">{isEmpty ? '·' : String(cellValue)}</div>
                        {dep?.label && !isActive && (
                          <div
                            className={cn(
                              'mt-1 inline-block rounded px-1 py-0.25 text-[9px] font-semibold leading-tight',
                              DEP_BADGE_STYLES[dep.tone ?? 'amber'],
                            )}
                          >
                            {dep.label}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
