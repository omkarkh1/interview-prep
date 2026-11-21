import {
  Activity,
  Cpu,
  Database,
  Globe,
  HardDrive,
  Layers,
  MessageSquare,
  Monitor,
  ShieldAlert,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { HldEdge, HldNode, HldNodeCategory } from '@/types/curriculum';

const NODE_DEFAULT_W = 148;
const NODE_DEFAULT_H = 58;

const CATEGORY_META: Record<
  HldNodeCategory,
  { label: string; dotColor: string; badgeVariant: 'default' | 'primary' | 'emerald' | 'amber' | 'rose' }
> = {
  client: { label: 'Client', dotColor: '#94a3b8', badgeVariant: 'default' },
  edge: { label: 'Edge / Routing', dotColor: '#38bdf8', badgeVariant: 'primary' },
  service: { label: 'Compute Service', dotColor: '#4f8ff7', badgeVariant: 'primary' },
  cache: { label: 'In-Memory Cache', dotColor: '#10b981', badgeVariant: 'emerald' },
  queue: { label: 'Async Stream', dotColor: '#f59e0b', badgeVariant: 'amber' },
  database: { label: 'Primary Store', dotColor: '#fb7185', badgeVariant: 'rose' },
  storage: { label: 'Object / Cold Store', dotColor: '#94a3b8', badgeVariant: 'default' },
};

function CategoryIcon({ category }: { category: HldNodeCategory }) {
  const cls = 'h-3.5 w-3.5 shrink-0';
  switch (category) {
    case 'client':
      return <Monitor className={cls} />;
    case 'edge':
      return <Globe className={cls} />;
    case 'service':
      return <Cpu className={cls} />;
    case 'cache':
      return <Zap className={cls} />;
    case 'queue':
      return <MessageSquare className={cls} />;
    case 'database':
      return <Database className={cls} />;
    case 'storage':
      return <HardDrive className={cls} />;
  }
}

function getAnchorPoint(
  node: HldNode,
  side: 'left' | 'right' | 'top' | 'bottom',
): { x: number; y: number } {
  const w = node.width ?? NODE_DEFAULT_W;
  const h = node.height ?? NODE_DEFAULT_H;
  switch (side) {
    case 'left':
      return { x: node.x, y: node.y + h / 2 };
    case 'right':
      return { x: node.x + w, y: node.y + h / 2 };
    case 'top':
      return { x: node.x + w / 2, y: node.y };
    case 'bottom':
      return { x: node.x + w / 2, y: node.y + h };
  }
}

function computeEdgeGeometry(fromNode: HldNode, toNode: HldNode, edge: HldEdge) {
  const fw = fromNode.width ?? NODE_DEFAULT_W;
  const fh = fromNode.height ?? NODE_DEFAULT_H;
  const tw = toNode.width ?? NODE_DEFAULT_W;
  const th = toNode.height ?? NODE_DEFAULT_H;

  const fc = { x: fromNode.x + fw / 2, y: fromNode.y + fh / 2 };
  const tc = { x: toNode.x + tw / 2, y: toNode.y + th / 2 };

  const dx = tc.x - fc.x;
  const dy = tc.y - fc.y;

  let fromSide: 'left' | 'right' | 'top' | 'bottom';
  let toSide: 'left' | 'right' | 'top' | 'bottom';

  if (edge.fromSide && edge.toSide) {
    fromSide = edge.fromSide;
    toSide = edge.toSide;
  } else if (Math.abs(dx) >= Math.abs(dy)) {
    fromSide = dx >= 0 ? 'right' : 'left';
    toSide = dx >= 0 ? 'left' : 'right';
  } else {
    fromSide = dy >= 0 ? 'bottom' : 'top';
    toSide = dy >= 0 ? 'top' : 'bottom';
  }

  const p1 = getAnchorPoint(fromNode, fromSide);
  const p2 = getAnchorPoint(toNode, toSide);

  // Smooth cubic bezier control points along exit/entry axes
  const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
  const pull = Math.min(Math.max(dist * 0.36, 26), 88);

  const offset = (pt: { x: number; y: number }, side: typeof fromSide) => {
    switch (side) {
      case 'right':
        return { x: pt.x + pull, y: pt.y };
      case 'left':
        return { x: pt.x - pull, y: pt.y };
      case 'bottom':
        return { x: pt.x, y: pt.y + pull };
      case 'top':
        return { x: pt.x, y: pt.y - pull };
    }
  };

  const c1 = offset(p1, fromSide);
  const c2 = offset(p2, toSide);

  const d = `M ${p1.x} ${p1.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${p2.x} ${p2.y}`;
  // Cubic bezier point at parameter t (default 0.5)
  const t = edge.labelT ?? 0.5;
  const u = 1 - t;
  const midX = u * u * u * p1.x + 3 * u * u * t * c1.x + 3 * u * t * t * c2.x + t * t * t * p2.x;
  const midY = u * u * u * p1.y + 3 * u * u * t * c1.y + 3 * u * t * t * c2.y + t * t * t * p2.y;

  return { d, midX, midY };
}

type FlowFilter = 'all' | 'write' | 'read';

interface HldDiagramExplorerProps {
  title: string;
  summary: string;
  defaultSelectedNodeId: string;
  nodes: HldNode[];
  edges: HldEdge[];
}

export function HldDiagramExplorer({
  title,
  summary,
  defaultSelectedNodeId,
  nodes,
  edges,
}: HldDiagramExplorerProps) {
  const [selectedId, setSelectedId] = useState<string>(defaultSelectedNodeId);
  const [flowFilter, setFlowFilter] = useState<FlowFilter>('all');

  const nodeMap = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);
  const selectedNode = nodeMap.get(selectedId) ?? nodes[0];

  const isEdgeHighlighted = (edge: HldEdge) => {
    if (flowFilter !== 'all' && edge.flow !== 'both' && edge.flow !== flowFilter) {
      return false;
    }
    return edge.from === selectedNode?.id || edge.to === selectedNode?.id;
  };

  const isEdgeVisibleInFlow = (edge: HldEdge) =>
    flowFilter === 'all' || edge.flow === 'both' || edge.flow === flowFilter;

  const isNodeActiveInFlow = (node: HldNode) =>
    flowFilter === 'all' || node.flows.includes(flowFilter);

  return (
    <section
      className="rounded-xl border border-border bg-card overflow-hidden"
      aria-label="Interactive architecture explorer"
      data-testid="hld-explorer"
    >
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-surface px-4 py-3">
        <div>
          <h3 className="text-xs font-semibold text-foreground">{title}</h3>
          <p className="mt-0.5 text-[11px] text-muted-foreground">{summary}</p>
        </div>

        {/* Read / Write / All Flow Filter */}
        <div className="inline-flex items-center rounded-lg border border-border bg-card p-0.5 text-xs">
          {(
            [
              { id: 'all', label: 'All Flows' },
              { id: 'write', label: 'Write Path' },
              { id: 'read', label: 'Read Path' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFlowFilter(tab.id)}
              className={cn(
                'rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors cursor-pointer',
                flowFilter === tab.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Split: SVG Architecture Canvas + Component Inspector Panel */}
      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.68fr)_352px]">
        {/* Canvas */}
        <div className="relative bg-[var(--code-bg)] p-3 sm:p-4 flex flex-col">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted-foreground px-1">
            <span>Click any component box to inspect its scaling & failure strategy</span>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#4f8ff7]" />
                Service
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#10b981]" />
                Cache
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#f59e0b]" />
                Async Queue
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#fb7185]" />
                DB
              </span>
            </div>
          </div>

          <div className="flex-1 flex items-center overflow-x-auto py-2">
            <svg
              viewBox="0 0 920 500"
              className="w-full h-auto min-w-[640px] select-none"
              role="group"
              aria-label={title}
            >
              <defs>
                <marker
                  id="hld-arrow-muted"
                  viewBox="0 0 10 10"
                  refX="8.5"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="var(--muted-foreground)" opacity="0.6" />
                </marker>
                <marker
                  id="hld-arrow-active"
                  viewBox="0 0 10 10"
                  refX="8.5"
                  refY="5"
                  markerWidth="6.5"
                  markerHeight="6.5"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#4f8ff7" />
                </marker>
                <marker
                  id="hld-arrow-async"
                  viewBox="0 0 10 10"
                  refX="8.5"
                  refY="5"
                  markerWidth="6.5"
                  markerHeight="6.5"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#f59e0b" />
                </marker>
              </defs>

              {/* Edges */}
              {edges.map((edge) => {
                const fromNode = nodeMap.get(edge.from);
                const toNode = nodeMap.get(edge.to);
                if (!fromNode || !toNode) return null;

                const { d, midX, midY } = computeEdgeGeometry(fromNode, toNode, edge);
                const visible = isEdgeVisibleInFlow(edge);
                const highlighted = isEdgeHighlighted(edge);
                const strokeColor = !visible
                  ? 'var(--border)'
                  : highlighted
                    ? edge.async
                      ? '#f59e0b'
                      : '#4f8ff7'
                    : edge.async
                      ? '#d97706'
                      : 'var(--muted-foreground)';

                return (
                  <g key={edge.id} style={{ opacity: visible ? (highlighted ? 1 : 0.62) : 0.14 }}>
                    <path
                      d={d}
                      fill="none"
                      stroke={strokeColor}
                      strokeWidth={highlighted ? 2.25 : 1.5}
                      strokeDasharray={edge.async ? '6 4' : undefined}
                      className={edge.async && visible ? 'hld-edge-flow' : undefined}
                      markerEnd={
                        highlighted
                          ? edge.async
                            ? 'url(#hld-arrow-async)'
                            : 'url(#hld-arrow-active)'
                          : 'url(#hld-arrow-muted)'
                      }
                    />
                    {edge.label && visible && (
                      <g transform={`translate(${midX}, ${midY})`}>
                        <rect
                          x={-(edge.label.length * 3.2 + 8)}
                          y={-9}
                          width={edge.label.length * 6.4 + 16}
                          height={18}
                          rx={4}
                          fill="var(--card)"
                          stroke={highlighted ? strokeColor : 'var(--border-strong)'}
                          strokeWidth={0.9}
                        />
                        <text
                          x={0}
                          y={3.5}
                          textAnchor="middle"
                          fill={highlighted ? 'var(--foreground)' : 'var(--muted-foreground)'}
                          className="font-mono text-[9.5px] font-medium"
                        >
                          {edge.label}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}

              {/* Interactive Component Nodes */}
              {nodes.map((node) => {
                const w = node.width ?? NODE_DEFAULT_W;
                const h = node.height ?? NODE_DEFAULT_H;
                const isSelected = node.id === selectedNode?.id;
                const inFlow = isNodeActiveInFlow(node);
                const meta = CATEGORY_META[node.category];

                return (
                  <g
                    key={node.id}
                    transform={`translate(${node.x}, ${node.y})`}
                    onClick={() => setSelectedId(node.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedId(node.id);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-pressed={isSelected}
                    aria-label={`Inspect ${node.label}`}
                    data-testid={`hld-node-${node.id}`}
                    className="cursor-pointer outline-none group"
                    style={{ opacity: inFlow ? 1 : 0.25 }}
                  >
                    {/* Selection outer halo */}
                    {isSelected && (
                      <rect
                        x={-3.5}
                        y={-3.5}
                        width={w + 7}
                        height={h + 7}
                        rx={12}
                        fill="none"
                        stroke="#4f8ff7"
                        strokeWidth={2}
                        strokeOpacity={0.5}
                      />
                    )}

                    {/* Node Card Body */}
                    <rect
                      x={0}
                      y={0}
                      width={w}
                      height={h}
                      rx={9}
                      fill={isSelected ? 'var(--surface-elevated)' : 'var(--card)'}
                      stroke={isSelected ? '#4f8ff7' : 'var(--border-strong)'}
                      strokeWidth={isSelected ? 1.8 : 1.15}
                    />

                    {/* Subtle top-left category indicator dot */}
                    <circle cx={14} cy={17} r={4} fill={meta.dotColor} />

                    {/* Node Title */}
                    <text
                      x={24}
                      y={21}
                      fill="var(--foreground)"
                      className="font-sans text-[12px] font-semibold"
                    >
                      {node.label}
                    </text>

                    {/* Node Sublabel */}
                    {node.sublabel && (
                      <text
                        x={14}
                        y={40}
                        fill="var(--muted-foreground)"
                        className="font-mono text-[10px]"
                      >
                        {node.sublabel}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Component Detail Inspector Panel */}
        {selectedNode && (
          <aside
            className="border-t xl:border-t-0 xl:border-l border-border bg-surface p-4 sm:p-5 flex flex-col gap-4"
            data-testid="hld-inspector-panel"
          >
            <div className="space-y-2 border-b border-border pb-3.5">
              <div className="flex items-center justify-between gap-2">
                <Badge variant={CATEGORY_META[selectedNode.category].badgeVariant}>
                  <CategoryIcon category={selectedNode.category} />
                  <span>{CATEGORY_META[selectedNode.category].label}</span>
                </Badge>
                <div className="flex items-center gap-1">
                  {selectedNode.flows.map((f) => (
                    <span
                      key={f}
                      className="rounded border border-border bg-card px-1.5 py-0.5 font-mono text-[10px] uppercase text-muted-foreground"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
              <h4 className="text-base font-semibold text-foreground tracking-tight">
                {selectedNode.label}
              </h4>
              {selectedNode.sublabel && (
                <p className="font-mono text-[11px] text-muted-foreground">{selectedNode.sublabel}</p>
              )}
            </div>

            <div className="space-y-3.5 text-xs leading-relaxed">
              <div>
                <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-foreground mb-1">
                  <Layers className="h-3.5 w-3.5 text-primary" />
                  <span>Exact Role</span>
                </div>
                <p className="text-muted-foreground">{selectedNode.details.role}</p>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-foreground mb-1">
                  <Activity className="h-3.5 w-3.5 text-blue-500" />
                  <span>Data Flow</span>
                </div>
                <p className="text-muted-foreground">{selectedNode.details.dataFlow}</p>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-foreground mb-1">
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Scaling Strategy</span>
                </div>
                <p className="text-muted-foreground">{selectedNode.details.scalingStrategy}</p>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-foreground mb-1">
                  <ShieldAlert className="h-3.5 w-3.5 text-amber-500" />
                  <span>Failure Handling</span>
                </div>
                <p className="text-muted-foreground">{selectedNode.details.failureHandling}</p>
              </div>

              {selectedNode.details.techChoices.length > 0 && (
                <div className="pt-1 border-t border-border">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Production Stack Examples
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedNode.details.techChoices.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md border border-border bg-card px-2 py-0.5 font-mono text-[10.5px] text-foreground"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        )}
      </div>
    </section>
  );
}
