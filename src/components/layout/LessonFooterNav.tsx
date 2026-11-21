import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { getAdjacentLessons, getLessonPath } from '@/data/curriculum';
import { useReaderState } from '@/hooks/useReaderState';
import type { Lesson } from '@/types/curriculum';

interface LessonFooterNavProps {
  lesson: Lesson;
}

export function LessonFooterNav({ lesson }: LessonFooterNavProps) {
  const navigate = useNavigate();
  const { isRead, toggleRead } = useReaderState();
  const { prev, next } = getAdjacentLessons(lesson.id);
  const read = isRead(lesson.id);

  const handleFinishAndContinue = () => {
    if (!read) toggleRead(lesson.id);
    if (next) {
      navigate(getLessonPath(next));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="mt-14 border-t border-border pt-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-surface px-4 py-3.5">
        <div>
          <div className="text-xs font-semibold text-foreground">
            {read ? 'Marked as read' : 'Finished reading this lesson?'}
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Progress is saved locally in your browser.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={read ? 'emerald' : 'outline'}
            size="sm"
            onClick={() => toggleRead(lesson.id)}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>{read ? 'Completed' : 'Mark as Read'}</span>
          </Button>
          {next && (
            <Button variant="default" size="sm" onClick={handleFinishAndContinue}>
              <span>{read ? 'Next Lesson' : 'Mark Read & Continue'}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {prev ? (
          <Link
            to={getLessonPath(prev)}
            className="group flex flex-col gap-1 rounded-xl border border-border bg-card p-4 hover:border-border-strong hover:bg-surface-elevated transition-colors"
          >
            <span className="inline-flex items-center gap-1 font-mono text-[10.5px] uppercase tracking-wider text-muted-foreground">
              <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-0.5" />
              Previous · Day {prev.dayNumber} {prev.kind}
            </span>
            <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
              {prev.title}
            </span>
          </Link>
        ) : (
          <div />
        )}

        {next ? (
          <Link
            to={getLessonPath(next)}
            className="group flex flex-col items-end gap-1 rounded-xl border border-border bg-card p-4 text-right hover:border-border-strong hover:bg-surface-elevated transition-colors"
          >
            <span className="inline-flex items-center gap-1 font-mono text-[10.5px] uppercase tracking-wider text-muted-foreground">
              Next · Day {next.dayNumber} {next.kind}
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </span>
            <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
              {next.title}
            </span>
          </Link>
        ) : (
          <div />
        )}
      </div>
    </footer>
  );
}
