import { ArrowLeft, Clock, Cpu, Layers, Lock, Network } from 'lucide-react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getDayByNumber, getLessonPath, getLessonsForDay } from '@/data/curriculum';
import { formatMinutes } from '@/lib/utils';

export function ComingSoonDayPage() {
  const { dayId } = useParams();
  const day = getDayByNumber(Number(dayId));

  if (!day) {
    return <Navigate to="/" replace />;
  }

  // If a complete day is visited at /day/:dayId, redirect straight to its first lesson
  if (day.status === 'complete') {
    const first = getLessonsForDay(day)[0];
    if (first) {
      return <Navigate to={getLessonPath(first)} replace />;
    }
  }

  return (
    <AppShell currentDayNumber={day.dayNumber}>
      <div className="mx-auto max-w-[820px] space-y-8 pb-12">
        <div className="space-y-4 border-b border-border pb-7">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="muted" className="font-mono">
              <Lock className="h-3 w-3" />
              Day {day.dayNumber} · Coming in Phase 2
            </Badge>
            <span className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              Est. {formatMinutes(day.estimatedMinutes)}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {day.title}
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground">{day.summary}</p>
        </div>

        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Planned Phase 2 Syllabus (5 DSA · 1 LLD · 1 HLD)
          </h2>

          <div className="rounded-xl border border-border bg-card divide-y divide-border/70">
            {(day.plannedPreview ?? []).map((item, idx) => (
              <div key={idx} className="flex items-start justify-between gap-4 px-5 py-3.5">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex items-center gap-1 rounded border border-border bg-surface px-2 py-0.5 font-mono text-[10px] font-semibold uppercase text-muted-foreground">
                    {item.kind === 'dsa' && <Cpu className="h-3 w-3" />}
                    {item.kind === 'lld' && <Layers className="h-3 w-3" />}
                    {item.kind === 'hld' && <Network className="h-3 w-3" />}
                    {item.kind}
                  </span>
                  <div>
                    <div className="text-sm font-medium text-foreground">{item.title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{item.focus}</div>
                  </div>
                </div>
                <span className="font-mono text-[10px] text-muted-foreground shrink-0">
                  Phase 2
                </span>
              </div>
            ))}
          </div>
        </section>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Button asChild variant="outline">
            <Link to="/">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Syllabus</span>
            </Link>
          </Button>
          <Button asChild>
            <Link to="/day/1/dsa/day1-longest-substring">Explore Day 1 (Live)</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link to="/day/5/dsa/day5-edit-distance">Explore Day 5 DP (Live)</Link>
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
