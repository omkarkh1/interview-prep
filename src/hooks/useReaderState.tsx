import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type ThemeMode = 'dark' | 'light';

interface ReaderStateContextValue {
  theme: ThemeMode;
  toggleTheme: () => void;
  readIds: Set<string>;
  bookmarkedIds: Set<string>;
  isRead: (lessonId: string) => boolean;
  isBookmarked: (lessonId: string) => boolean;
  toggleRead: (lessonId: string) => void;
  toggleBookmark: (lessonId: string) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
  lastVisitedPath: string | null;
  recordVisitedPath: (path: string) => void;
}

const STORAGE_KEYS = {
  read: 'staff-reader:read',
  bookmarks: 'staff-reader:bookmarks',
  theme: 'staff-reader:theme',
  sidebar: 'staff-reader:sidebar-collapsed',
  lastPath: 'staff-reader:last-path',
} as const;

function readStringArray(key: string): string[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter((v): v is string => typeof v === 'string');
    }
  } catch {
    // Ignore storage read failures (e.g., private browsing restrictions)
  }
  return [];
}

function readTheme(): ThemeMode {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.theme);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch {
    // fallback
  }
  return 'dark';
}

function readSidebarCollapsed(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEYS.sidebar) === 'true';
  } catch {
    return false;
  }
}

function readLastPath(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEYS.lastPath);
  } catch {
    return null;
  }
}

const ReaderStateContext = createContext<ReaderStateContextValue | null>(null);

export function ReaderStateProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>(readTheme);
  const [readList, setReadList] = useState<string[]>(() => readStringArray(STORAGE_KEYS.read));
  const [bookmarkedList, setBookmarkedList] = useState<string[]>(() =>
    readStringArray(STORAGE_KEYS.bookmarks),
  );
  const [sidebarCollapsed, setSidebarCollapsedState] = useState<boolean>(readSidebarCollapsed);
  const [lastVisitedPath, setLastVisitedPath] = useState<string | null>(readLastPath);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'light');
    root.classList.add(theme);
    try {
      localStorage.setItem(STORAGE_KEYS.theme, theme);
    } catch {
      // ignore
    }
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.read, JSON.stringify(readList));
    } catch {
      // ignore
    }
  }, [readList]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.bookmarks, JSON.stringify(bookmarkedList));
    } catch {
      // ignore
    }
  }, [bookmarkedList]);

  const setSidebarCollapsed = useCallback((collapsed: boolean) => {
    setSidebarCollapsedState(collapsed);
    try {
      localStorage.setItem(STORAGE_KEYS.sidebar, String(collapsed));
    } catch {
      // ignore
    }
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsedState((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEYS.sidebar, String(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const toggleRead = useCallback((lessonId: string) => {
    setReadList((prev) =>
      prev.includes(lessonId) ? prev.filter((id) => id !== lessonId) : [...prev, lessonId],
    );
  }, []);

  const toggleBookmark = useCallback((lessonId: string) => {
    setBookmarkedList((prev) =>
      prev.includes(lessonId) ? prev.filter((id) => id !== lessonId) : [...prev, lessonId],
    );
  }, []);

  const recordVisitedPath = useCallback((path: string) => {
    if (!path || path === '/') return;
    setLastVisitedPath(path);
    try {
      localStorage.setItem(STORAGE_KEYS.lastPath, path);
    } catch {
      // ignore
    }
  }, []);

  const readIds = useMemo(() => new Set(readList), [readList]);
  const bookmarkedIds = useMemo(() => new Set(bookmarkedList), [bookmarkedList]);

  const isRead = useCallback((lessonId: string) => readIds.has(lessonId), [readIds]);
  const isBookmarked = useCallback((lessonId: string) => bookmarkedIds.has(lessonId), [bookmarkedIds]);

  const value = useMemo<ReaderStateContextValue>(
    () => ({
      theme,
      toggleTheme,
      readIds,
      bookmarkedIds,
      isRead,
      isBookmarked,
      toggleRead,
      toggleBookmark,
      sidebarCollapsed,
      setSidebarCollapsed,
      toggleSidebar,
      lastVisitedPath,
      recordVisitedPath,
    }),
    [
      theme,
      toggleTheme,
      readIds,
      bookmarkedIds,
      isRead,
      isBookmarked,
      toggleRead,
      toggleBookmark,
      sidebarCollapsed,
      setSidebarCollapsed,
      toggleSidebar,
      lastVisitedPath,
      recordVisitedPath,
    ],
  );

  return <ReaderStateContext.Provider value={value}>{children}</ReaderStateContext.Provider>;
}

export function useReaderState(): ReaderStateContextValue {
  const ctx = useContext(ReaderStateContext);
  if (!ctx) {
    throw new Error('useReaderState must be used within ReaderStateProvider');
  }
  return ctx;
}
