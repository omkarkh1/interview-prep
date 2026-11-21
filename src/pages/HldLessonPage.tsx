import {
  Calculator,
  CheckCircle2,
  Database,
  Network,
  Scale,
  Server,
  ShieldCheck,
  XCircle,
} from 'lucide-react';
import { Navigate, useParams } from 'react-router-dom';
import { HldDiagramExplorer } from '@/components/hld/HldDiagramExplorer';
import { AppShell } from '@/components/layout/AppShell';
import { LessonFooterNav } from '@/components/layout/LessonFooterNav';
import { Badge } from '@/components/ui/badge';
import { getDayByNumber } from '@/data/curriculum';
import { cn } from '@/lib/utils';

const METHOD_BADGE = {
  GET: 'border-emerald-500/30 bg-emerald-500/12 text-emerald-700 dark:text-emerald-300',
  POST: 'border-blue-500/30 bg-blue-500/12 text-blue-700 dark:text-blue-300',
  PUT: 'border-amber-500/30 bg-amber-500/12 text-amber-700 dark:text-amber-300',
  DELETE: 'border-rose-500/30 bg-rose-500/12 text-rose-700 dark:text-rose-300',
} as const;

export function HldLessonPage() {
  const { dayId, lessonId } = useParams();
  const day = getDayByNumber(Number(dayId));
  const lesson = day?.hldLesson && day.hldLesson.id === lessonId ? day.hldLesson : undefined;

  if (!lesson) {
    return <Navigate to="/" replace />;
  }

  return (
    <AppShell currentLesson={lesson}>
      <article className="mx-auto max-w-[1120px] space-y-11 pb-12">
        {/* Header */}
        <header className="space-y-4 border-b border-border pb-7">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="emerald" className="font-mono">
              <Network className="h-3 w-3" />
              Day {lesson.dayNumber} · HLD
            </Badge>
            {lesson.tags.map((tag) => (
              <Badge key={tag} variant="default">
                {tag}
              </Badge>
            ))}
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {lesson.title}
            </h1>
            <p className="mt-1.5 text-sm sm:text-base text-muted-foreground">{lesson.subtitle}</p>
          </div>

          <p className="editorial-prose text-sm max-w-[880px] text-foreground/90">
            {lesson.overview}
          </p>
        </header>

        {/* 01 · Requirements */}
        <section className="space-y-4">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs font-semibold text-primary">01</span>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              Functional & Non-Functional Requirements
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.3fr)] gap-4">
            <div className="rounded-xl border border-border bg-card p-5 space-y-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-foreground">
                Functional Requirements
              </div>
              <ul className="space-y-2.5 text-xs leading-relaxed text-foreground/90">
                {lesson.requirements.functional.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="border-b border-border bg-surface px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-foreground">
                Non-Functional Targets (SLO Calibration)
              </div>
              <div className="divide-y divide-border/70">
                {lesson.requirements.nonFunctional.map((nfr) => (
                  <div key={nfr.metric} className="px-4 py-3 space-y-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-foreground">{nfr.metric}</span>
                      <span className="rounded border border-blue-500/25 bg-blue-500/10 px-2 py-0.5 font-mono text-[11px] font-semibold text-blue-700 dark:text-blue-300">
                        {nfr.target}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed text-muted-foreground">{nfr.rationale}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 02 · Pre-Computed Back-of-the-Envelope Capacity Math */}
        <section className="space-y-4">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs font-semibold text-primary">02</span>
            <h2 className="text-lg font-semibold tracking-tight text-foreground flex items-center gap-2">
              <Calculator className="h-4 w-4 text-primary" />
              <span>Back-of-the-Envelope Capacity Math</span>
            </h2>
          </div>

          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="border-b border-border bg-surface px-5 py-3.5 space-y-1.5">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Baseline Traffic & Sizing Assumptions
              </div>
              <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-foreground/90">
                {lesson.capacityMath.assumptions.map((a, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {a}
                  </span>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-border bg-surface/50 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    <th className="px-4 py-2.5">Metric</th>
                    <th className="px-4 py-2.5">Formula</th>
                    <th className="px-4 py-2.5">Result</th>
                    <th className="px-4 py-2.5">Architectural Implication</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/70">
                  {lesson.capacityMath.calculations.map((row) => (
                    <tr key={row.metric} className="align-top">
                      <td className="px-4 py-3 font-semibold text-foreground whitespace-nowrap">
                        {row.metric}
                      </td>
                      <td className="px-4 py-3 font-mono text-[11.5px] text-muted-foreground whitespace-nowrap">
                        {row.formula}
                      </td>
                      <td className="px-4 py-3 font-mono text-[11.5px] font-semibold text-emerald-700 dark:text-emerald-300 whitespace-nowrap">
                        {row.result}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground leading-relaxed">
                        {row.notes}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* 03 · Interactive Architecture Diagram Explorer */}
        <section className="space-y-4">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs font-semibold text-primary">03</span>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              Interactive System Architecture
            </h2>
          </div>

          <HldDiagramExplorer
            key={lesson.id}
            title={lesson.architecture.title}
            summary={lesson.architecture.summary}
            defaultSelectedNodeId={lesson.architecture.defaultSelectedNodeId}
            nodes={lesson.architecture.nodes}
            edges={lesson.architecture.edges}
          />
        </section>

        {/* 04 · API Contracts & Storage Schema */}
        <section className="space-y-4">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs font-semibold text-primary">04</span>
            <h2 className="text-lg font-semibold tracking-tight text-foreground flex items-center gap-2">
              <Server className="h-4 w-4 text-primary" />
              <span>API Contracts & Storage Schema</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded-xl border border-border bg-card p-5 space-y-3.5">
              <div className="text-xs font-semibold uppercase tracking-wider text-foreground">
                Core Endpoints
              </div>
              {lesson.apiAndDataModel.endpoints.map((ep, idx) => (
                <div key={idx} className="rounded-lg border border-border bg-surface p-3.5 space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={cn(
                        'rounded border px-1.5 py-0.5 font-mono text-[10px] font-bold',
                        METHOD_BADGE[ep.method],
                      )}
                    >
                      {ep.method}
                    </span>
                    <code className="font-mono text-xs font-semibold text-foreground">
                      {ep.path}
                    </code>
                  </div>
                  <p className="text-xs text-muted-foreground">{ep.summary}</p>
                  {ep.payload && (
                    <div className="rounded border border-border bg-card px-2.5 py-1.5 font-mono text-[11px] text-foreground/90 overflow-x-auto">
                      {ep.payload}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-border bg-card p-5 space-y-3.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-foreground">
                <Database className="h-3.5 w-3.5 text-primary" />
                <span>Data Model & Partitioning</span>
              </div>
              {lesson.apiAndDataModel.storageSchema.map((st, idx) => (
                <div key={idx} className="rounded-lg border border-border bg-surface p-3.5 space-y-1.5">
                  <div className="text-xs font-semibold text-foreground">{st.store}</div>
                  <div className="rounded border border-border bg-card px-2.5 py-1.5 font-mono text-[11px] text-blue-700 dark:text-blue-300 overflow-x-auto">
                    {st.schema}
                  </div>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {st.shardingAndIndexing}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 05 · Senior Trade-Offs Comparison Cards */}
        <section className="space-y-4">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs font-semibold text-primary">05</span>
            <h2 className="text-lg font-semibold tracking-tight text-foreground flex items-center gap-2">
              <Scale className="h-4 w-4 text-primary" />
              <span>Senior Trade-Offs (4.5-YOE Calibration)</span>
            </h2>
          </div>

          <div className="space-y-5">
            {lesson.tradeOffs.map((to) => (
              <div key={to.topic} className="rounded-xl border border-border bg-card p-5 space-y-4">
                <div>
                  <h3 className="text-base font-semibold text-foreground">{to.topic}</h3>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{to.context}</p>
                </div>

                <div
                  className={cn(
                    'grid grid-cols-1 gap-3.5',
                    to.options.length === 3 ? 'lg:grid-cols-3' : 'md:grid-cols-2',
                  )}
                >
                  {to.options.map((opt) => (
                    <div
                      key={opt.name}
                      className={cn(
                        'rounded-lg border p-4 flex flex-col justify-between gap-3',
                        opt.recommended
                          ? 'border-emerald-500/45 bg-emerald-500/6'
                          : 'border-border bg-surface',
                      )}
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-semibold text-foreground">{opt.name}</span>
                          {opt.recommended && <Badge variant="emerald">Recommended</Badge>}
                        </div>

                        <ul className="space-y-1 text-xs text-foreground/90">
                          {opt.pros.map((p, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500 mt-0.5" />
                              <span>{p}</span>
                            </li>
                          ))}
                        </ul>

                        <ul className="space-y-1 text-xs text-muted-foreground">
                          {opt.cons.map((c, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <XCircle className="h-3.5 w-3.5 shrink-0 text-rose-500/80 mt-0.5" />
                              <span>{c}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="border-t border-border/70 pt-2 text-[11px] text-muted-foreground">
                        <span className="font-semibold text-foreground">When to choose: </span>
                        {opt.whenToChoose}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="rounded-lg border border-blue-500/25 bg-blue-500/8 px-4 py-3 text-xs leading-relaxed flex items-start gap-2.5">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-blue-500 mt-0.5" />
                  <div>
                    <span className="font-semibold text-blue-700 dark:text-blue-300">
                      4.5-YOE Interview Verdict:{' '}
                    </span>
                    <span className="text-foreground">{to.seniorVerdict}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <LessonFooterNav lesson={lesson} />
      </article>
    </AppShell>
  );
}
