import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ReaderStateProvider } from '@/hooks/useReaderState';
import { ComingSoonDayPage } from '@/pages/ComingSoonDayPage';
import { DsaLessonPage } from '@/pages/DsaLessonPage';
import { HldLessonPage } from '@/pages/HldLessonPage';
import { HomePage } from '@/pages/HomePage';
import { LldLessonPage } from '@/pages/LldLessonPage';

export default function App() {
  return (
    <ReaderStateProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/day/:dayId" element={<ComingSoonDayPage />} />
          <Route path="/day/:dayId/dsa/:lessonId" element={<DsaLessonPage />} />
          <Route path="/day/:dayId/lld/:lessonId" element={<LldLessonPage />} />
          <Route path="/day/:dayId/hld/:lessonId" element={<HldLessonPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </ReaderStateProvider>
  );
}
