import {
  Blocks,
  CheckCircle2,
  GitBranch,
  Layers,
  Lock,
  ShieldCheck,
  Wrench,
  XCircle,
} from 'lucide-react';
import { Navigate, useParams } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { LessonFooterNav } from '@/components/layout/LessonFooterNav';
import { MermaidDiagram } from '@/components/lld/MermaidDiagram';
import { TabbedCodeWalkthrough } from '@/components/lld/TabbedCodeWalkthrough';
import { Badge } from '@/components/ui/badge';
import { getDayByNumber } from '@/data/curriculum';

export function LldLessonPage() {
  const { dayId, lessonId } = useParams();
  const day = getDayByNumber(Number(dayId));
  const lesson = day?.lldLesson && day.lldLesson.id === lessonId ? day.lldLesson : undefined;

  if (!lesson) {
    return <Navigate to="/" replace />;
  }

  return (
    <AppShell currentLesson={lesson}>
      <article className="mx-auto max-w-[1020px] space-y-11 pb-12">
        {/* Header */}
        <header className="space-y-4 border-b border-border pb-7">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="amber" className="font-mono">
              <Layers className="h-3 w-3" />
              Day {lesson.dayNumber} · LLD
            </Badge>
            {lesson.patterns.map((p) => (
              <Badge key={p} variant="default">
                {p}
              </Badge>
            ))}
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {lesson.title}
            </h1>
            <p className="mt-1.5 text-sm sm:text-base text-muted-foreground">{lesson.subtitle}</p>
          </div>
        </header>

        {/* 01 · Problem Scope & Requirements */}
        <section className="space-y-4">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs font-semibold text-primary">01</span>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              Problem Scope & 4.5-YOE Framing
            </h2>
          </div>

          <div className="rounded-xl border border-border bg-card p-5 space-y-5">
            <p className="editorial-prose text-sm">{lesson.problemScope.summary}</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-lg border border-border bg-surface p-4 space-y-2">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-300">
                  Functional Scope
                </div>
                <ul className="space-y-1.5 text-xs leading-relaxed text-foreground/90">
                  {lesson.problemScope.functionalRequirements.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500 mt-0.5" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-lg border border-border bg-surface p-4 space-y-2">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-300">
                  Concurrency & Scale
                </div>
                <ul className="space-y-1.5 text-xs leading-relaxed text-foreground/90">
                  {lesson.problemScope.concurrencyAndScaleAssumptions.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <Lock className="h-3.5 w-3.5 shrink-0 text-blue-500 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-lg border border-border bg-surface p-4 space-y-2">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Explicit Non-Goals
                </div>
                <ul className="space-y-1.5 text-xs leading-relaxed text-muted-foreground">
                  {lesson.problemScope.explicitNonGoals.map((ng, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <XCircle className="h-3.5 w-3.5 shrink-0 opacity-60 mt-0.5" />
                      <span>{ng}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 02 · Core Entities & Invariants */}
        <section className="space-y-4">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs font-semibold text-primary">02</span>
            <h2 className="text-lg font-semibold tracking-tight text-foreground flex items-center gap-2">
              <Blocks className="h-4 w-4 text-primary" />
              <span>Core Entities & Domain Invariants</span>
            </h2>
          </div>

          <div className="overflow-x-auto rounded-xl border border-border bg-card">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border bg-surface text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  <th className="px-4 py-3">Entity</th>
                  <th className="px-4 py-3">Responsibility</th>
                  <th className="px-4 py-3">Key State / Fields</th>
                  <th className="px-4 py-3">Invariant</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/70">
                {lesson.coreEntities.map((entity) => (
                  <tr key={entity.name} className="align-top">
                    <td className="px-4 py-3 font-mono font-semibold text-foreground whitespace-nowrap">
                      {entity.name}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground leading-relaxed">
                      {entity.role}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {entity.keyFields.map((field) => (
                          <code
                            key={field}
                            className="rounded border border-border bg-surface px-1.5 py-0.5 text-[10.5px] text-foreground"
                          >
                            {field}
                          </code>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-foreground/90 leading-relaxed">
                      {entity.invariants}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 03 · Why These Design Patterns? */}
        <section className="space-y-4">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs font-semibold text-primary">03</span>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              Why These Design Patterns?
            </h2>
          </div>

          <div className="space-y-4">
            {lesson.designPatterns.map((dp) => (
              <div key={dp.pattern} className="rounded-xl border border-border bg-card p-5 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold text-foreground">{dp.pattern}</h3>
                  <span className="font-mono text-[11px] text-muted-foreground">
                    Applied in: {dp.whereUsed}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  <div className="rounded-lg border border-rose-500/20 bg-rose-500/6 p-3.5 space-y-1">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-rose-700 dark:text-rose-300">
                      What Breaks Without It
                    </div>
                    <p className="text-xs leading-relaxed text-foreground/90">
                      {dp.whatBreaksWithoutIt}
                    </p>
                  </div>

                  <div className="rounded-lg border border-emerald-500/25 bg-emerald-500/8 p-3.5 space-y-1">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                      How the Pattern Solves It
                    </div>
                    <p className="text-xs leading-relaxed text-foreground/90">{dp.howItSolvesIt}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 04 · UML Class & Sequence Diagrams */}
        <section className="space-y-5">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs font-semibold text-primary">04</span>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              UML Class & Sequence Diagrams
            </h2>
          </div>

          <MermaidDiagram
            title={lesson.diagrams.classDiagram.title}
            caption={lesson.diagrams.classDiagram.caption}
            chart={lesson.diagrams.classDiagram.mermaid}
            testId="lld-class-diagram"
          />

          <MermaidDiagram
            title={lesson.diagrams.sequenceDiagram.title}
            caption={lesson.diagrams.sequenceDiagram.caption}
            chart={lesson.diagrams.sequenceDiagram.mermaid}
            testId="lld-sequence-diagram"
          />
        </section>

        {/* 05 · Tabbed Production Java Code Walkthrough */}
        <section className="space-y-4">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs font-semibold text-primary">05</span>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              Production Java Code Walkthrough
            </h2>
          </div>

          <TabbedCodeWalkthrough files={lesson.codeFiles} />
        </section>

        {/* 06 · SOLID, Extensibility & Concurrency Choices */}
        <section className="space-y-5">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs font-semibold text-primary">06</span>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              SOLID Principles, Extensibility & Thread-Safety
            </h2>
          </div>

          {/* SOLID grid */}
          <div className="rounded-xl border border-border bg-card p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-foreground">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>SOLID Principles in Action</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {lesson.solidHighlights.map((item) => (
                <div
                  key={item.principle}
                  className="rounded-lg border border-border bg-surface p-3.5 space-y-1"
                >
                  <div className="font-mono text-xs font-semibold text-primary">
                    {item.principle}
                  </div>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {item.application}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Extensibility + Concurrency */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded-xl border border-border bg-card p-5 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-foreground">
                <GitBranch className="h-4 w-4 text-blue-500" />
                <span>Extensibility Follow-Ups</span>
              </div>
              <div className="space-y-3">
                {lesson.extensibilityScenarios.map((ext, idx) => (
                  <div key={idx} className="rounded-lg border border-border bg-surface p-3.5 space-y-1">
                    <div className="text-xs font-semibold text-foreground">{ext.scenario}</div>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {ext.changesRequired}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-5 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-foreground">
                <Wrench className="h-4 w-4 text-amber-500" />
                <span>Thread-Safety & Locking Choices</span>
              </div>
              <div className="space-y-3">
                {lesson.concurrencyChoices.map((cc, idx) => (
                  <div key={idx} className="rounded-lg border border-border bg-surface p-3.5 space-y-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-foreground">{cc.topic}</span>
                      <code className="rounded bg-card border border-border px-1.5 py-0.5 text-[10px] text-primary">
                        {cc.mechanism}
                      </code>
                    </div>
                    <p className="text-xs leading-relaxed text-muted-foreground">{cc.rationale}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <LessonFooterNav lesson={lesson} />
      </article>
    </AppShell>
  );
}
