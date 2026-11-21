import type { TreeGraphStep, TreeGraphVisualizer } from '@/types/curriculum';

interface TreeGraphRendererProps {
  spec: TreeGraphVisualizer;
  step: TreeGraphStep;
}

export function TreeGraphRenderer({ spec, step }: TreeGraphRendererProps) {
  const width = spec.viewBoxWidth ?? 760;
  const height = spec.viewBoxHeight ?? 340;
  const nodeMap = new Map(spec.nodes.map((n) => [n.id, n]));
  const depSet = new Set(step.dependencyNodeIds ?? []);
  const visitedSet = new Set(step.visitedNodeIds ?? []);
  const highlightedSet = new Set(step.highlightedNodeIds ?? []);
  const activeEdgeSet = new Set((step.activeEdges ?? []).map((e) => `${e.from}->${e.to}`));

  return (
    <div className="space-y-4">
      {step.formula && (
        <div className="rounded-lg border border-blue-500/30 bg-blue-500/8 px-3.5 py-2.5 font-mono text-xs text-blue-800 dark:text-blue-200">
          {step.formula}
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-blue-500" />
          <span>Active Node</span>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full border-2 border-amber-500 bg-amber-500/20" />
          <span>Child Dependencies</span>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full border-2 border-emerald-500 bg-emerald-500/20" />
          <span>Evaluated / Optimal</span>
        </span>
      </div>

      <div className="rounded-lg border border-border bg-surface/70 p-2 overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto max-h-[360px] select-none"
          role="img"
          aria-label={spec.title}
        >
          {/* Edges */}
          {spec.edges.map((edge) => {
            const from = nodeMap.get(edge.from);
            const to = nodeMap.get(edge.to);
            if (!from || !to) return null;
            const isActiveEdge = activeEdgeSet.has(`${edge.from}->${edge.to}`);

            return (
              <g key={`${edge.from}-${edge.to}`}>
                <line
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke={isActiveEdge ? '#f59e0b' : 'currentColor'}
                  strokeOpacity={isActiveEdge ? 0.95 : 0.22}
                  strokeWidth={isActiveEdge ? 2.5 : 1.75}
                  strokeDasharray={isActiveEdge ? '5 4' : undefined}
                />
                {edge.weight && (
                  <text
                    x={(from.x + to.x) / 2}
                    y={(from.y + to.y) / 2 - 6}
                    textAnchor="middle"
                    className="fill-muted-foreground font-mono text-[11px]"
                  >
                    {edge.weight}
                  </text>
                )}
              </g>
            );
          })}

          {/* Nodes */}
          {spec.nodes.map((node) => {
            const isActive = step.activeNodeId === node.id;
            const isDep = depSet.has(node.id);
            const isHighlighted = highlightedSet.has(node.id);
            const isVisited = visitedSet.has(node.id);
            const stateBadge = step.nodeStates[node.id];

            const fill = isActive
              ? '#3b82f6'
              : isHighlighted
                ? '#10b981'
                : isDep
                  ? 'rgba(245, 158, 11, 0.22)'
                  : isVisited
                    ? 'rgba(16, 185, 129, 0.14)'
                    : 'var(--card)';

            const stroke = isActive
              ? '#60a5fa'
              : isHighlighted
                ? '#34d399'
                : isDep
                  ? '#f59e0b'
                  : isVisited
                    ? '#10b981'
                    : 'var(--border-strong)';

            const textFill = isActive || isHighlighted ? '#ffffff' : 'var(--foreground)';

            return (
              <g key={node.id}>
                {isActive && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={28}
                    fill="none"
                    stroke="#3b82f6"
                    strokeOpacity={0.35}
                    strokeWidth={4}
                  />
                )}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={22}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={2}
                />
                <text
                  x={node.x}
                  y={node.y + 5}
                  textAnchor="middle"
                  fill={textFill}
                  className="font-mono text-sm font-bold"
                >
                  {node.label}
                </text>

                {/* Per-node DP tuple pill rendered cleanly beneath node */}
                {stateBadge && (
                  <g transform={`translate(${node.x}, ${node.y + 34})`}>
                    <rect
                      x={-Math.max(stateBadge.length * 3.7 + 12, 64)}
                      y={-11}
                      width={Math.max(stateBadge.length * 7.4 + 24, 128)}
                      height={22}
                      rx={6}
                      fill={isActive ? '#1d4ed8' : isDep ? '#92400e' : 'var(--surface-elevated)'}
                      stroke={isActive ? '#60a5fa' : isDep ? '#f59e0b' : 'var(--border-strong)'}
                      strokeWidth={1}
                    />
                    <text
                      x={0}
                      y={3.5}
                      textAnchor="middle"
                      fill={isActive || isDep ? '#ffffff' : 'var(--foreground)'}
                      className="font-mono text-[10.5px] font-medium"
                    >
                      {stateBadge}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
