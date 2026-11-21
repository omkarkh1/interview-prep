import {
  ArrowRight,
  Bookmark,
  CheckCircle2,
  Clock,
  Cpu,
  Layers,
  Network,
} from 'lucide-react';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CURRICULUM, getAllAvailableLessons, getLessonPath, getLessonsForDay } from '@/data/curriculum';
import { useReaderState } from '@/hooks/useReaderState';
import { cn, formatMinutes } from '@/lib/utils';

export function HomePage() {
  const { readIds, bookmarkedIds, lastVisitedPath } = useReaderState();

  const availableLessons = useMemo(() => getAllAvailableLessons(), []);
  const readCount = useMemo(
    () => availableLessons.filter((l) => readIds.has(l.id)).length,
    [availableLessons, readIds],
  );
  const bookmarkedLessons = useMemo(
    () => availableLessons.filter((l) => bookmarkedIds.has(l.id)),
    [availableLessons, bookmarkedIds],
  );
  const totalReadingMinutes = useMemo(
    () => availableLessons.reduce((acc, l) => acc + l.estimatedMinutes, 0),
    [availableLessons],
  );

  const firstUnread = useMemo(
    () => availableLessons.find((l) => !readIds.has(l.id)) ?? availableLessons[0],
    [availableLessons, readIds],
  );
  const resumeTarget = lastVisitedPath ?? (firstUnread ? getLessonPath(firstUnread) : '/');

  const scrollToDay = (dayNumber: number) => {
    const el = document.getElementById(`syllabus-day-${dayNumber}`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-[980px] space-y-10 pb-12">
        {/* Editorial Hero Header */}
        <section className="space-y-5 border-b border-border pb-8">
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-muted-foreground">
            <span>4.5 YOE SDE INTERVIEW HANDBOOK</span>
            <span>·</span>
            <span>COMPLETE 7-DAY EDITION</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              7-Day Staff Reader
            </h1>
            <p className="max-w-[700px] text-[15.5px] leading-relaxed text-muted-foreground">
              A calm, textbook-grade study reader for Senior / SDE-2+ interviews. Absorb 35 DSA
              patterns via step-by-step visual dry runs, 7 production Java LLD systems with UML
              diagrams, and 7 interactive HLD architectures — zero blank editors, zero countdown
              timers.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Button asChild size="default">
              <Link to={resumeTarget}>
                <span>{lastVisitedPath ? 'Continue Reading' : 'Start Day 1'}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="default">
              <Link to="/day/7/hld/day7-payment-stripe-ledger">
                <span>Featured · Stripe Ledger HLD</span>
              </Link>
            </Button>
          </div>

          {/* Minimal Editorial Stats Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
            <div className="rounded-lg border border-border bg-card px-4 py-3">
              <div className="text-[11px] font-medium text-muted-foreground">Overall Progress</div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-mono text-xl font-semibold text-foreground">
                  {readCount}/{availableLessons.length}
                </span>
                <span className="font-mono text-[11px] text-emerald-500">
                  {availableLessons.length > 0
                    ? Math.round((readCount / availableLessons.length) * 100)
                    : 0}
                  %
                </span>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card px-4 py-3">
              <div className="text-[11px] font-medium text-muted-foreground">Total Reading Time</div>
              <div className="mt-1 font-mono text-xl font-semibold text-foreground">
                {formatMinutes(totalReadingMinutes)}
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card px-4 py-3">
              <div className="text-[11px] font-medium text-muted-foreground">Bookmarked</div>
              <div className="mt-1 font-mono text-xl font-semibold text-foreground">
                {bookmarkedLessons.length}
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card px-4 py-3">
              <div className="text-[11px] font-medium text-muted-foreground">Full Curriculum</div>
              <div className="mt-1 font-mono text-sm font-semibold text-foreground pt-1">
                35 DSA · 7 LLD · 7 HLD
              </div>
            </div>
          </div>
        </section>

        {/* Bookmarked Quick Revision Shelf (if user has saved lessons) */}
        {bookmarkedLessons.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Bookmark className="h-4 w-4 text-amber-500 fill-amber-500" />
                <span>Bookmarked for Revision</span>
              </h2>
              <span className="font-mono text-xs text-muted-foreground">
                {bookmarkedLessons.length} saved
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {bookmarkedLessons.map((lesson) => (
                <Link
                  key={lesson.id}
                  to={getLessonPath(lesson)}
                  className="group flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-3 hover:border-border-strong hover:bg-surface-elevated transition-colors"
                >
                  <div className="min-w-0">
                    <div className="font-mono text-[10.5px] uppercase text-muted-foreground">
                      Day {lesson.dayNumber} · {lesson.kind}
                    </div>
                    <div className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                      {lesson.title}
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Complete 7-Day Syllabus */}
        <section className="space-y-5">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-foreground">
                7-Day Reading Syllabus
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                All 7 days (49 interactive lessons) complete — jump straight to any day or lesson below.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-1.5" aria-label="Jump to day">
              {CURRICULUM.map((day) => (
                <button
                  key={day.dayNumber}
                  type="button"
                  onClick={() => scrollToDay(day.dayNumber)}
                  className="rounded-md border border-border bg-card px-2.5 py-1 font-mono text-[11px] font-medium text-muted-foreground hover:border-border-strong hover:text-foreground transition-colors cursor-pointer"
                >
                  Day {day.dayNumber}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {CURRICULUM.map((day) => {
              const lessons = getLessonsForDay(day);
              const dayRead = lessons.filter((l) => readIds.has(l.id)).length;
              const pct = lessons.length > 0 ? Math.round((dayRead / lessons.length) * 100) : 0;

              return (
                <article
                  key={day.dayNumber}
                  id={`syllabus-day-${day.dayNumber}`}
                  className="scroll-mt-20 rounded-xl border border-border bg-card overflow-hidden"
                >
                  {/* Day Header */}
                  <div className="border-b border-border bg-surface/75 px-5 py-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="primary" className="font-mono">
                            DAY {day.dayNumber}
                          </Badge>
                          <span className="font-mono text-[11px] text-muted-foreground">
                            {day.theme}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold tracking-tight text-foreground">
                          {day.title}
                        </h3>
                      </div>

                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1 font-mono">
                            <Clock className="h-3.5 w-3.5" />
                            {formatMinutes(day.estimatedMinutes)}
                          </span>
                          <span className="font-mono font-semibold text-foreground">
                            {dayRead}/{lessons.length} read
                          </span>
                        </div>
                        <div className="h-1.5 w-32 overflow-hidden rounded-full bg-muted">
                          <div
                            className={cn(
                              'h-full rounded-full transition-all',
                              pct === 100 ? 'bg-emerald-500' : 'bg-primary',
                            )}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <p className="mt-2.5 text-xs leading-relaxed text-muted-foreground max-w-3xl">
                      {day.summary}
                    </p>
                  </div>

                  {/* Direct Lesson List: DSA (5) + LLD (1) + HLD (1) */}
                  <div className="divide-y divide-border/70">
                    {lessons.map((lesson) => {
                      const read = readIds.has(lesson.id);
                      const bookmarked = bookmarkedIds.has(lesson.id);

                      return (
                        <Link
                          key={lesson.id}
                          to={getLessonPath(lesson)}
                          className="group flex items-center justify-between gap-4 px-5 py-3 hover:bg-surface/65 transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span
                              className={cn(
                                'inline-flex h-6 w-12 shrink-0 items-center justify-center gap-1 rounded border font-mono text-[10px] font-semibold uppercase',
                                lesson.kind === 'dsa'
                                  ? 'border-blue-500/25 bg-blue-500/10 text-blue-700 dark:text-blue-300'
                                  : lesson.kind === 'lld'
                                    ? 'border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300'
                                    : 'border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
                              )}
                            >
                              {lesson.kind === 'dsa' && <Cpu className="h-3 w-3" />}
                              {lesson.kind === 'lld' && <Layers className="h-3 w-3" />}
                              {lesson.kind === 'hld' && <Network className="h-3 w-3" />}
                              {lesson.kind}
                            </span>

                            <div className="min-w-0">
                              <div className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                                {lesson.title}
                              </div>
                              <div className="text-xs text-muted-foreground truncate">
                                {lesson.subtitle}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2.5 shrink-0">
                            <span className="font-mono text-[11px] text-muted-foreground">
                              {lesson.estimatedMinutes}m
                            </span>
                            {bookmarked && (
                              <Bookmark className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                            )}
                            {read ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                            ) : (
                              <ArrowRight className="h-4 w-4 text-muted-foreground/60 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                            )}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
