import { HashRouter, Navigate, Route, Routes, useParams } from 'react-router-dom';
import { getDayByNumber, getLessonPath, getLessonsForDay } from '@/data/curriculum';
import { ReaderStateProvider } from '@/hooks/useReaderState';
import { DsaLessonPage } from '@/pages/DsaLessonPage';
import { HldLessonPage } from '@/pages/HldLessonPage';
import { HomePage } from '@/pages/HomePage';
import { LldLessonPage } from '@/pages/LldLessonPage';

function DayEntryRedirect() {
  const { dayId } = useParams();
  const day = getDayByNumber(Number(dayId));
  const first = day ? getLessonsForDay(day)[0] : undefined;
  return <Navigate to={first ? getLessonPath(first) : '/'} replace />;
}

export default function App() {
  return (
    <ReaderStateProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/day/:dayId" element={<DayEntryRedirect />} />
          <Route path="/day/:dayId/dsa/:lessonId" element={<DsaLessonPage />} />
          <Route path="/day/:dayId/lld/:lessonId" element={<LldLessonPage />} />
          <Route path="/day/:dayId/hld/:lessonId" element={<HldLessonPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </ReaderStateProvider>
  );
}
