import { useEffect, useState, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { useReaderState } from '@/hooks/useReaderState';
import type { Lesson } from '@/types/curriculum';

interface AppShellProps {
  currentLesson?: Lesson;
  currentDayNumber?: number;
  children: ReactNode;
}

export function AppShell({ currentLesson, currentDayNumber, children }: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { recordVisitedPath } = useReaderState();

  useEffect(() => {
    window.scrollTo({ top: 0 });
    if (currentLesson) {
      recordVisitedPath(location.pathname);
    }
  }, [location.pathname, currentLesson, recordVisitedPath]);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />

      <div className="flex flex-1 flex-col min-w-0">
        <TopBar
          currentLesson={currentLesson}
          currentDayNumber={currentDayNumber}
          onOpenMobileMenu={() => setMobileOpen(true)}
        />
        <main className="flex-1 px-4 py-8 sm:px-8 lg:px-10">{children}</main>
      </div>
    </div>
  );
}
