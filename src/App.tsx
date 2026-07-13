import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from './components/AppShell';

const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const CoursesPage = lazy(() => import('./pages/CoursesPage'));
const LibraryPage = lazy(() => import('./pages/LibraryPage'));
const LessonPage = lazy(() => import('./pages/LessonPage'));
const FlashcardsPage = lazy(() => import('./pages/FlashcardsPage'));
const PracticePage = lazy(() => import('./pages/PracticePage'));
const NclexPage = lazy(() => import('./pages/NclexPage'));
const DosageLabPage = lazy(() => import('./pages/DosageLabPage'));
const ClinicalSkillsPage = lazy(() => import('./pages/ClinicalSkillsPage'));
const QuickSheetsPage = lazy(() => import('./pages/QuickSheetsPage'));
const StudyPlannerPage = lazy(() => import('./pages/StudyPlannerPage'));
const DownloadsPage = lazy(() => import('./pages/DownloadsPage'));
const NotebookPage = lazy(() => import('./pages/NotebookPage'));
const ProgressPage = lazy(() => import('./pages/ProgressPage'));
const AskLoloPage = lazy(() => import('./pages/AskLoloPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function Loading() {
  return <div className="route-loading" role="status"><span /><span /><span /><p>Opening your study space…</p></div>;
}

export default function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<DashboardPage />} />
          <Route path="courses" element={<CoursesPage />} />
          <Route path="library" element={<LibraryPage />} />
          <Route path="lessons/:lessonId" element={<LessonPage />} />
          <Route path="flashcards" element={<FlashcardsPage />} />
          <Route path="practice" element={<PracticePage />} />
          <Route path="nclex" element={<NclexPage />} />
          <Route path="dosage-lab" element={<DosageLabPage />} />
          <Route path="clinical-skills" element={<ClinicalSkillsPage />} />
          <Route path="quick-sheets" element={<QuickSheetsPage />} />
          <Route path="study-planner" element={<StudyPlannerPage />} />
          <Route path="downloads" element={<DownloadsPage />} />
          <Route path="notebook" element={<NotebookPage />} />
          <Route path="progress" element={<ProgressPage />} />
          <Route path="ask-lolo" element={<AskLoloPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="dashboard" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

