import {
  Bookmark,
  Check,
  Clock,
  Menu,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Sun,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useReaderState } from '@/hooks/useReaderState';
import type { Lesson } from '@/types/curriculum';

interface TopBarProps {
  currentLesson?: Lesson;
  currentDayNumber?: number;
  onOpenMobileMenu: () => void;
}

export function TopBar({ currentLesson, currentDayNumber, onOpenMobileMenu }: TopBarProps) {
  const {
    theme,
    toggleTheme,
    isRead,
    isBookmarked,
    toggleRead,
    toggleBookmark,
    sidebarCollapsed,
    toggleSidebar,
  } = useReaderState();

  const read = currentLesson ? isRead(currentLesson.id) : false;
  const bookmarked = currentLesson ? isBookmarked(currentLesson.id) : false;

  return (
    <header className="sticky top-0 z-30 flex h-[52px] items-center justify-between gap-3 border-b border-border bg-background/88 px-4 backdrop-blur-md">
      {/* Left: Sidebar Toggle + Editorial Breadcrumb */}
      <div className="flex items-center gap-2.5 min-w-0">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          aria-label="Open navigation menu"
          className="lg:hidden rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
        >
          <Menu className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={toggleSidebar}
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="hidden lg:inline-flex rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
        >
          {sidebarCollapsed ? (
            <PanelLeftOpen className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
        </button>

        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-xs text-muted-foreground min-w-0 truncate"
        >
          <Link to="/" className="hover:text-foreground transition-colors shrink-0">
            Syllabus
          </Link>
          {currentLesson ? (
            <>
              <span className="opacity-45">/</span>
              <span className="font-mono text-[11px] shrink-0">Day {currentLesson.dayNumber}</span>
              <span className="opacity-45">/</span>
              <span className="font-mono text-[11px] uppercase shrink-0">{currentLesson.kind}</span>
              <span className="opacity-45 hidden sm:inline">/</span>
              <span className="hidden sm:inline truncate font-medium text-foreground">
                {currentLesson.title}
              </span>
            </>
          ) : currentDayNumber ? (
            <>
              <span className="opacity-45">/</span>
              <span className="font-medium text-foreground">Day {currentDayNumber}</span>
            </>
          ) : (
            <>
              <span className="opacity-45">/</span>
              <span className="font-medium text-foreground">Overview</span>
            </>
          )}
        </nav>
      </div>

      {/* Right: Lesson Actions + Theme Switch */}
      <div className="flex items-center gap-2 shrink-0">
        {currentLesson && (
          <>
            <span className="hidden md:inline-flex items-center gap-1 font-mono text-[11px] text-muted-foreground mr-1">
              <Clock className="h-3.5 w-3.5" />
              {currentLesson.estimatedMinutes} min read
            </span>

            <Button
              variant={bookmarked ? 'amber' : 'outline'}
              size="sm"
              onClick={() => toggleBookmark(currentLesson.id)}
              aria-pressed={bookmarked}
              data-testid="toggle-bookmark"
            >
              <Bookmark className={bookmarked ? 'h-3.5 w-3.5 fill-current' : 'h-3.5 w-3.5'} />
              <span className="hidden sm:inline">{bookmarked ? 'Bookmarked' : 'Bookmark'}</span>
            </Button>

            <Button
              variant={read ? 'emerald' : 'outline'}
              size="sm"
              onClick={() => toggleRead(currentLesson.id)}
              aria-pressed={read}
              data-testid="toggle-read"
            >
              <Check className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{read ? 'Read' : 'Mark as Read'}</span>
            </Button>
          </>
        )}

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          data-testid="toggle-theme"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </div>
    </header>
  );
}
