import { AlertTriangle, CheckCircle2, Compass, Cpu, Gauge, Lightbulb, Zap } from 'lucide-react';
import { Navigate, useParams } from 'react-router-dom';
import { AnnotatedCodeBlock } from '@/components/code/AnnotatedCodeBlock';
import { VisualStepper } from '@/components/dsa/VisualStepper';
import { AppShell } from '@/components/layout/AppShell';
import { LessonFooterNav } from '@/components/layout/LessonFooterNav';
import { Badge } from '@/components/ui/badge';
import { getDayByNumber } from '@/data/curriculum';

export function DsaLessonPage() {
  const { dayId, lessonId } = useParams();
  const day = getDayByNumber(Number(dayId));
  const lesson = day?.dsaLessons.find((l) => l.id === lessonId);

  if (!lesson) {
    return <Navigate to="/" replace />;
  }

  return (
    <AppShell currentLesson={lesson}>
      <article className="mx-auto max-w-[980px] space-y-10 pb-12">
        {/* Lesson Title Header */}
        <header className="space-y-4 border-b border-border pb-7">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="primary" className="font-mono">
              <Cpu className="h-3 w-3" />
              Day {lesson.dayNumber} · DSA
            </Badge>
            <Badge variant={lesson.difficulty === 'Hard' ? 'rose' : 'amber'} className="font-mono">
              {lesson.difficulty}
            </Badge>
            {lesson.leetcodeRef && (
              <Badge variant="muted" className="font-mono">
                {lesson.leetcodeRef}
              </Badge>
            )}
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

          {/* Problem Statement & Concrete Example */}
          <div className="rounded-xl border border-border bg-card p-4 sm:p-5 space-y-3">
            <p className="editorial-prose text-sm sm:text-[15px]">{lesson.problemStatement}</p>
            <div className="rounded-lg border border-border bg-surface px-3.5 py-2.5 font-mono text-xs space-y-1">
              <div>
                <span className="text-muted-foreground">Input: </span>
                <span className="text-foreground font-medium">{lesson.exampleSummary.input}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Output: </span>
                <span className="text-emerald-600 dark:text-emerald-300 font-semibold">
                  {lesson.exampleSummary.output}
                </span>
              </div>
              <p className="font-sans text-xs text-muted-foreground pt-1 leading-relaxed">
                {lesson.exampleSummary.explanation}
              </p>
            </div>
          </div>
        </header>

        {/* 01 · Pattern Recognition Cue */}
        <section className="space-y-3.5">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs font-semibold text-primary">01</span>
            <h2 className="text-lg font-semibold tracking-tight text-foreground flex items-center gap-2">
              <Compass className="h-4 w-4 text-primary" />
              <span>How to Spot This in an Interview</span>
            </h2>
          </div>

          <div className="rounded-xl border border-border bg-card p-5 space-y-4">
            <p className="editorial-prose text-sm">{lesson.patternRecognition.interviewCue}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <div className="rounded-lg border border-border bg-surface p-4 space-y-2">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Interview Signal Checklist
                </div>
                <ul className="space-y-1.5 text-xs leading-relaxed text-foreground/90">
                  {lesson.patternRecognition.signals.map((sig, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500 mt-0.5" />
                      <span>{sig}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-lg border border-blue-500/25 bg-blue-500/6 p-4 space-y-2">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-300">
                  <Lightbulb className="h-3.5 w-3.5" />
                  <span>Core Mental Model</span>
                </div>
                <p className="text-xs leading-relaxed text-foreground whitespace-pre-line">
                  {lesson.patternRecognition.mentalModel}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 02 · Brute Force vs Optimal Intuition */}
        <section className="space-y-3.5">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs font-semibold text-primary">02</span>
            <h2 className="text-lg font-semibold tracking-tight text-foreground flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              <span>Brute Force vs. Optimal Intuition</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Brute Force Card */}
            <div className="rounded-xl border border-border bg-card p-5 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold text-foreground">Baseline Brute Force</span>
                <div className="flex items-center gap-1.5 font-mono">
                  <Badge variant="rose">{lesson.intuitionComparison.bruteForce.timeComplexity}</Badge>
                  <Badge variant="muted">{lesson.intuitionComparison.bruteForce.spaceComplexity}</Badge>
                </div>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {lesson.intuitionComparison.bruteForce.approach}
              </p>
              <div className="rounded-lg border border-rose-500/20 bg-rose-500/6 px-3 py-2.5 text-xs leading-relaxed">
                <span className="font-semibold text-rose-700 dark:text-rose-300">Bottleneck: </span>
                <span className="text-foreground/90">
                  {lesson.intuitionComparison.bruteForce.bottleneck}
                </span>
              </div>
            </div>

            {/* Optimal Card */}
            <div className="rounded-xl border border-border bg-card p-5 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold text-foreground">Optimal Strategy</span>
                <div className="flex items-center gap-1.5 font-mono">
                  <Badge variant="emerald">{lesson.intuitionComparison.optimal.timeComplexity}</Badge>
                  <Badge variant="primary">{lesson.intuitionComparison.optimal.spaceComplexity}</Badge>
                </div>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {lesson.intuitionComparison.optimal.approach}
              </p>
              <div className="rounded-lg border border-emerald-500/25 bg-emerald-500/8 px-3 py-2.5 text-xs leading-relaxed">
                <span className="font-semibold text-emerald-700 dark:text-emerald-300">
                  Key Invariant:{' '}
                </span>
                <span className="text-foreground/90">
                  {lesson.intuitionComparison.optimal.keyInvariant}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 03 · Interactive Visual Stepper */}
        <section className="space-y-3.5">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs font-semibold text-primary">03</span>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              Interactive Visual Dry Run
            </h2>
          </div>

          <VisualStepper key={lesson.id} spec={lesson.visualizer} />
        </section>

        {/* 04 · Annotated Read-Only Java Solution */}
        <section className="space-y-3.5">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs font-semibold text-primary">04</span>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              Annotated Java Solution
            </h2>
          </div>

          <AnnotatedCodeBlock
            filename={lesson.javaSolution.filename}
            code={lesson.javaSolution.code}
            callouts={lesson.javaSolution.callouts}
            language="java"
          />
        </section>

        {/* 05 · Complexity Breakdown & 4.5-YOE Edge Cases */}
        <section className="space-y-5">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs font-semibold text-primary">05</span>
            <h2 className="text-lg font-semibold tracking-tight text-foreground flex items-center gap-2">
              <Gauge className="h-4 w-4 text-primary" />
              <span>Complexity & 4.5-YOE Interview Edge Cases</span>
            </h2>
          </div>

          {/* Time & Space Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-border bg-card p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Time Complexity
                </span>
                <span className="rounded-md border border-emerald-500/30 bg-emerald-500/12 px-2 py-0.5 font-mono text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                  {lesson.complexity.time}
                </span>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {lesson.complexity.timeExplanation}
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Space Complexity
                </span>
                <span className="rounded-md border border-blue-500/30 bg-blue-500/12 px-2 py-0.5 font-mono text-xs font-semibold text-blue-700 dark:text-blue-300">
                  {lesson.complexity.space}
                </span>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {lesson.complexity.spaceExplanation}
              </p>
            </div>
          </div>

          {/* Edge Cases & Senior Follow-ups */}
          <div className="space-y-3">
            {lesson.edgeCases.map((ec, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-border bg-card p-4 space-y-1.5"
              >
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500" />
                  <span>{ec.title}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <span className="font-medium text-foreground/85">Scenario: </span>
                  {ec.scenario}
                </p>
                <p className="text-xs text-foreground/90 leading-relaxed">
                  <span className="font-medium text-emerald-600 dark:text-emerald-300">
                    Senior Handling:{' '}
                  </span>
                  {ec.handling}
                </p>
              </div>
            ))}
          </div>
        </section>

        <LessonFooterNav lesson={lesson} />
      </article>
    </AppShell>
  );
}
