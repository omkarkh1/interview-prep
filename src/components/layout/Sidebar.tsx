import {
  Bookmark,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Cpu,
  Layers,
  Network,
  X,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CURRICULUM, getAllAvailableLessons, getLessonPath, getLessonsForDay } from '@/data/curriculum';
import { useReaderState } from '@/hooks/useReaderState';
import { cn, formatMinutes } from '@/lib/utils';
import type { LessonKind } from '@/types/curriculum';

function KindIcon({ kind, className }: { kind: LessonKind; className?: string }) {
  switch (kind) {
    case 'dsa':
      return <Cpu className={cn('h-3.5 w-3.5 shrink-0', className)} />;
    case 'lld':
      return <Layers className={cn('h-3.5 w-3.5 shrink-0', className)} />;
    case 'hld':
      return <Network className={cn('h-3.5 w-3.5 shrink-0', className)} />;
  }
}

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export function Sidebar({ mobileOpen, onCloseMobile }: SidebarProps) {
  const location = useLocation();
  const { isRead, isBookmarked, readIds, bookmarkedIds, sidebarCollapsed } = useReaderState();
  const [filterMode, setFilterMode] = useState<'all' | 'bookmarked'>('all');
  const [expandedOverrides, setExpandedOverrides] = useState<Record<number, boolean>>({});

  const activeDayNumber = useMemo(() => {
    const match = location.pathname.match(/^\/day\/(\d+)/);
    return match ? Number(match[1]) : 1;
  }, [location.pathname]);

  const allAvailable = useMemo(() => getAllAvailableLessons(), []);
  const bookmarkedLessons = useMemo(
    () => allAvailable.filter((l) => bookmarkedIds.has(l.id)),
    [allAvailable, bookmarkedIds],
  );
  const completedCount = useMemo(
    () => allAvailable.filter((l) => readIds.has(l.id)).length,
    [allAvailable, readIds],
  );

  const isDayExpanded = (dayNumber: number) =>
    expandedOverrides[dayNumber] ?? dayNumber === activeDayNumber;

  const toggleDay = (dayNumber: number) => {
    setExpandedOverrides((prev) => ({
      ...prev,
      [dayNumber]: !(prev[dayNumber] ?? dayNumber === activeDayNumber),
    }));
  };

  const sidebarBody = (
    <div className="flex h-full flex-col bg-surface text-foreground">
      {/* Brand header */}
      <div className="flex h-[52px] shrink-0 items-center justify-between border-b border-border px-4">
        <Link
          to="/"
          onClick={onCloseMobile}
          className="flex items-center gap-2.5 min-w-0 group"
        >
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border-strong bg-card font-mono text-xs font-bold text-primary">
            7D
          </div>
          <div className="min-w-0">
            <div className="text-[13px] font-semibold tracking-tight text-foreground truncate group-hover:text-primary transition-colors">
              7-Day Staff Reader
            </div>
            <div className="font-mono text-[10px] text-muted-foreground">4.5 YOE Handbook</div>
          </div>
        </Link>

        <button
          type="button"
          onClick={onCloseMobile}
          aria-label="Close navigation menu"
          className="lg:hidden rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Mode Switcher: All Days vs. Bookmarked */}
      <div className="shrink-0 border-b border-border p-3 space-y-2.5">
        <div
          className="grid grid-cols-2 rounded-lg border border-border bg-card p-0.5 text-xs"
          role="tablist"
          aria-label="Sidebar view filter"
        >
          <button
            type="button"
            role="tab"
            aria-selected={filterMode === 'all'}
            onClick={() => setFilterMode('all')}
            data-testid="sidebar-filter-all"
            className={cn(
              'flex items-center justify-center gap-1.5 rounded-md py-1.5 font-medium transition-colors cursor-pointer',
              filterMode === 'all'
                ? 'bg-surface-elevated text-foreground shadow-2xs'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>Curriculum</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={filterMode === 'bookmarked'}
            onClick={() => setFilterMode('bookmarked')}
            data-testid="sidebar-filter-bookmarked"
            className={cn(
              'flex items-center justify-center gap-1.5 rounded-md py-1.5 font-medium transition-colors cursor-pointer',
              filterMode === 'bookmarked'
                ? 'bg-surface-elevated text-foreground shadow-2xs'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <Bookmark className="h-3.5 w-3.5" />
            <span>Bookmarked</span>
            {bookmarkedLessons.length > 0 && (
              <span className="rounded-full bg-amber-500/20 px-1.5 py-0.25 font-mono text-[10px] font-semibold text-amber-600 dark:text-amber-300">
                {bookmarkedLessons.length}
              </span>
            )}
          </button>
        </div>

        {/* Overall reading progress bar */}
        <div className="px-0.5">
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="text-muted-foreground">Reading Progress</span>
            <span className="font-mono font-medium text-foreground">
              {completedCount}/{allAvailable.length}
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-300"
              style={{
                width: `${allAvailable.length > 0 ? Math.round((completedCount / allAvailable.length) * 100) : 0}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Scrollable Navigation Body */}
      <nav className="flex-1 overflow-y-auto px-2.5 py-3 space-y-1.5" aria-label="7-Day Curriculum">
        {filterMode === 'bookmarked' ? (
          bookmarkedLessons.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border bg-card/50 p-4 text-center space-y-1.5 mt-2">
              <Bookmark className="h-5 w-5 mx-auto text-muted-foreground/60" />
              <div className="text-xs font-medium text-foreground">No bookmarks yet</div>
              <p className="text-[11px] leading-relaxed text-muted-foreground">
                Click <span className="font-medium text-foreground">Bookmark</span> on any DSA, LLD, or HLD lesson to save it for last-day revision.
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Saved for Revision ({bookmarkedLessons.length})
              </div>
              {bookmarkedLessons.map((lesson) => {
                const path = getLessonPath(lesson);
                const active = location.pathname === path;
                const read = isRead(lesson.id);

                return (
                  <Link
                    key={lesson.id}
                    to={path}
                    onClick={onCloseMobile}
                    className={cn(
                      'flex items-start gap-2 rounded-lg px-2.5 py-2 text-xs transition-colors',
                      active
                        ? 'bg-accent text-accent-foreground font-medium'
                        : 'text-foreground/85 hover:bg-muted/70 hover:text-foreground',
                    )}
                  >
                    <KindIcon
                      kind={lesson.kind}
                      className={cn('mt-0.5', active ? 'text-primary' : 'text-muted-foreground')}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="truncate leading-snug">{lesson.title}</div>
                      <div className="mt-0.5 flex items-center gap-2 font-mono text-[10px] text-muted-foreground">
                        <span>Day {lesson.dayNumber}</span>
                        <span>·</span>
                        <span className="uppercase">{lesson.kind}</span>
                        <span>·</span>
                        <span>{lesson.estimatedMinutes}m</span>
                      </div>
                    </div>
                    {read && <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500 mt-0.5" />}
                  </Link>
                );
              })}
            </div>
          )
        ) : (
          CURRICULUM.map((day) => {
            const lessons = getLessonsForDay(day);
            const dayReadCount = lessons.filter((l) => readIds.has(l.id)).length;
            const dayPercent =
              lessons.length > 0 ? Math.round((dayReadCount / lessons.length) * 100) : 0;
            const isExpanded = isDayExpanded(day.dayNumber);

            return (
              <div
                key={day.dayNumber}
                className="rounded-lg border border-border/70 bg-card/50 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggleDay(day.dayNumber)}
                  aria-expanded={isExpanded}
                  data-testid={`sidebar-day-${day.dayNumber}`}
                  className="w-full px-2.5 py-2.5 text-left hover:bg-muted/40 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      {isExpanded ? (
                        <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                      )}
                      <span className="shrink-0 whitespace-nowrap font-mono text-[11px] font-semibold text-primary">
                        Day {day.dayNumber}
                      </span>
                      <span className="truncate text-xs font-semibold text-foreground">
                        {day.title.split(',')[0]}
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-muted-foreground shrink-0">
                      {dayReadCount}/{lessons.length}
                    </span>
                  </div>

                  {/* Per-day progress bar + estimated reading time */}
                  <div className="mt-2 pl-5 pr-0.5 space-y-1">
                    <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className={cn(
                          'h-full rounded-full transition-all duration-300',
                          dayPercent === 100 ? 'bg-emerald-500' : 'bg-primary',
                        )}
                        style={{ width: `${dayPercent}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-2.5 w-2.5" />
                        {formatMinutes(day.estimatedMinutes)}
                      </span>
                      <span className="font-mono">{dayPercent}% read</span>
                    </div>
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t border-border/60 bg-card px-1.5 py-1.5 space-y-0.5">
                    {lessons.map((lesson) => {
                      const path = getLessonPath(lesson);
                      const active = location.pathname === path;
                      const read = isRead(lesson.id);
                      const bookmarked = isBookmarked(lesson.id);

                      return (
                        <Link
                          key={lesson.id}
                          to={path}
                          onClick={onCloseMobile}
                          className={cn(
                            'group flex items-start gap-2 rounded-md px-2 py-1.5 text-[12px] transition-colors',
                            active
                              ? 'bg-accent text-accent-foreground font-medium'
                              : 'text-foreground/80 hover:bg-muted/65 hover:text-foreground',
                          )}
                        >
                          <KindIcon
                            kind={lesson.kind}
                            className={cn(
                              'mt-0.5',
                              active
                                ? 'text-primary'
                                : lesson.kind === 'lld'
                                  ? 'text-amber-500/80'
                                  : lesson.kind === 'hld'
                                    ? 'text-emerald-500/80'
                                    : 'text-muted-foreground',
                            )}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="truncate leading-snug">{lesson.title}</div>
                            <div className="mt-0.5 flex items-center gap-1.5 font-mono text-[9.5px] text-muted-foreground">
                              <span className="uppercase">{lesson.kind}</span>
                              <span>·</span>
                              <span>{lesson.estimatedMinutes}m</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 mt-0.5 shrink-0">
                            {bookmarked && (
                              <Bookmark className="h-3 w-3 fill-amber-500 text-amber-500" />
                            )}
                            {read && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </nav>
    </div>
  );

  return (
    <>
      {/* Desktop Collapsible Sticky Sidebar */}
      <aside
        className={cn(
          'hidden lg:block sticky top-0 h-screen shrink-0 border-r border-border transition-all duration-200 overflow-x-hidden',
          sidebarCollapsed ? 'w-0 border-r-0' : 'w-[284px]',
        )}
        aria-label="Primary sidebar"
      >
        <div className="h-full w-[284px]">{sidebarBody}</div>
      </aside>

      {/* Mobile Slide-Over Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <div className="relative z-10 h-full w-[292px] max-w-[85vw] border-r border-border shadow-2xl">
            {sidebarBody}
          </div>
        </div>
      )}
    </>
  );
}
