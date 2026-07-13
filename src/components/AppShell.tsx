import {
  BarChart3, BookMarked, BookOpen, Calculator, CalendarDays, ChevronLeft, ChevronRight,
  CircleHelp, ClipboardCheck, Download, FileText, FlaskConical, GraduationCap, Home, Menu,
  Moon, NotebookPen, Search, Settings, Sparkles, Stethoscope, Sun, X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { lessons } from '../content/catalog';
import { useLearning } from '../context/LearningContext';
import { Logo } from './Logo';
import { SearchCommand } from './SearchCommand';
import { StudyTimer } from './StudyTimer';

const navigation = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/courses', label: 'Courses', icon: GraduationCap },
  { to: '/library', label: 'Lesson library', icon: BookOpen },
  { to: '/flashcards', label: 'Flashcards', icon: BookMarked },
  { to: '/practice', label: 'Practice tests', icon: ClipboardCheck },
  { to: '/nclex', label: 'NCLEX prep', icon: FlaskConical },
  { to: '/dosage-lab', label: 'Dosage lab', icon: Calculator },
  { to: '/clinical-skills', label: 'Clinical skills', icon: Stethoscope },
  { to: '/quick-sheets', label: 'Quick sheets', icon: FileText },
  { to: '/study-planner', label: 'Study planner', icon: CalendarDays },
  { to: '/downloads', label: 'Downloads', icon: Download },
  { to: '/notebook', label: 'Notes & bookmarks', icon: NotebookPen },
  { to: '/progress', label: 'Progress', icon: BarChart3 },
  { to: '/ask-lolo', label: 'Ask LOLO', icon: Sparkles },
  { to: '/settings', label: 'Settings', icon: Settings },
];

// Keep this origin aligned with index.html, robots.txt, and sitemap.xml.
const productionSiteOrigin = 'https://nursing-with-lolo.netlify.app';

export function AppShell() {
  const { state, updateSettings } = useLearning();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  const pageTitle = useMemo(() => {
    const section = navigation.find((item) => item.to !== '/' && location.pathname.startsWith(item.to));
    if (section) return section.label;
    if (location.pathname.startsWith('/lessons/')) {
      const lessonId = decodeURIComponent(location.pathname.slice('/lessons/'.length).split('/')[0]);
      return lessons.find((lesson) => lesson.id === lessonId)?.title ?? 'Lesson';
    }
    return location.pathname === '/' ? 'Dashboard' : 'Page not found';
  }, [location.pathname]);

  useEffect(() => setMobileOpen(false), [location.pathname]);
  useEffect(() => {
    const canonicalUrl = new URL(location.pathname, productionSiteOrigin).toString();
    document.title = `${pageTitle} | NURSING with LOLO`;
    document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.setAttribute('href', canonicalUrl);
    document.querySelector<HTMLMetaElement>('meta[property="og:url"]')?.setAttribute('content', canonicalUrl);
    document.querySelector<HTMLMetaElement>('meta[property="og:title"]')?.setAttribute('content', `${pageTitle} | NURSING with LOLO`);
    document.querySelector<HTMLMetaElement>('meta[name="twitter:title"]')?.setAttribute('content', `${pageTitle} | NURSING with LOLO`);
  }, [location.pathname, pageTitle]);
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); setSearchOpen(true); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const dark = document.documentElement.dataset.theme === 'dark';

  return (
    <div className={`app-shell ${collapsed ? 'app-shell--collapsed' : ''}`}>
      <aside className={`sidebar ${mobileOpen ? 'sidebar--open' : ''}`} aria-label="Primary navigation">
        <div className="sidebar__head">
          <Logo compact={collapsed} />
          <button className="icon-button sidebar__mobile-close" onClick={() => setMobileOpen(false)} aria-label="Close navigation"><X /></button>
        </div>
        <div className="sidebar__study-card">
          <span className="eyebrow">TODAY'S FOCUS</span>
          <strong>Build calm, clinical thinking.</strong>
          {!collapsed && <span>{state.dailyGoalMinutes} minute goal · one step at a time</span>}
        </div>
        <nav className="sidebar__nav">
          {navigation.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} title={collapsed ? label : undefined}>
              <Icon size={19} aria-hidden="true" /><span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar__foot">
          <button onClick={() => setCollapsed((value) => !value)} aria-label={collapsed ? 'Expand navigation' : 'Collapse navigation'}>
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}<span>Collapse</span>
          </button>
          <p><CircleHelp size={15} /> <span>Study aid · verify clinical policy</span></p>
        </div>
      </aside>
      {mobileOpen && <button className="mobile-scrim" aria-label="Close menu" onClick={() => setMobileOpen(false)} />}
      <div className="app-main">
        <header className="topbar">
          <div className="topbar__title">
            <button className="icon-button topbar__menu" onClick={() => setMobileOpen(true)} aria-label="Open navigation"><Menu /></button>
            <div><span className="eyebrow">NURSING WITH LOLO</span><strong>{pageTitle}</strong></div>
          </div>
          <div className="topbar__actions">
            <button className="search-trigger" onClick={() => setSearchOpen(true)} aria-label="Search anything"><Search size={17} aria-hidden="true" /><span>Search anything</span><kbd>Ctrl K</kbd></button>
            <StudyTimer />
            <button className="icon-button" onClick={() => updateSettings({ theme: dark ? 'light' : 'dark' })} aria-label={dark ? 'Use light theme' : 'Use dark theme'}>
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <div className="avatar" title={`Local learner: ${state.learnerName}`}>{state.learnerName.slice(0, 2).toUpperCase()}</div>
          </div>
        </header>
        <main id="main-content" className="page-shell" tabIndex={-1}><Outlet /></main>
        <footer className="site-footer">
          <span><strong>NURSING with LOLO</strong> is an independent study aid, not an accredited program or medical advice.</span>
          <span>Verify current textbooks, instructors, scope, and facility policy.</span>
        </footer>
      </div>
      <nav className="mobile-nav" aria-label="Mobile navigation">
        {navigation.slice(0, 5).map(({ to, label, icon: Icon, end }) => <NavLink key={to} to={to} end={end}><Icon /><span>{label.replace('Lesson ', '')}</span></NavLink>)}
      </nav>
      <SearchCommand open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
