import {
  Activity, BookMarked, BookOpen, Calculator, CalendarDays, ChevronLeft, ChevronRight,
  CircleHelp, ClipboardCheck, Download, FileText, FlaskConical, GraduationCap, Home, Menu,
  HeartPulse, Moon, NotebookPen, Pill, Search, Settings, Sparkles, Stethoscope, Sun, Syringe, X,
  type LucideIcon,
} from 'lucide-react';
import { type MouseEvent as ReactMouseEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { lessons } from '../content/catalog';
import { useLearning } from '../context/LearningContext';
import { Logo } from './Logo';
import { SearchCommand } from './SearchCommand';
import { StudyTimer } from './StudyTimer';

interface NavigationItem {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
}

interface NavigationGroup {
  label: string;
  items: NavigationItem[];
}

const navigationGroups: NavigationGroup[] = [
  {
    label: 'Start here',
    items: [
      { to: '/', label: 'Home', icon: Home, end: true },
      { to: '/courses', label: 'Courses', icon: GraduationCap },
      { to: '/library', label: 'Lesson library', icon: BookOpen },
    ],
  },
  {
    label: 'Study & practice',
    items: [
      { to: '/flashcards', label: 'Flashcards', icon: BookMarked },
      { to: '/practice', label: 'Practice tests', icon: ClipboardCheck },
      { to: '/nclex', label: 'NCLEX prep', icon: FlaskConical },
      { to: '/dosage-lab', label: 'Dosage lab', icon: Calculator },
    ],
  },
  {
    label: 'Clinical toolbox',
    items: [
      { to: '/clinical-skills', label: 'Clinical skills', icon: Stethoscope },
      { to: '/quick-sheets', label: 'Quick sheets', icon: FileText },
      { to: '/study-planner', label: 'Study planner', icon: CalendarDays },
      { to: '/downloads', label: 'Downloads', icon: Download },
    ],
  },
  {
    label: 'My learning',
    items: [
      { to: '/notebook', label: 'Notes & bookmarks', icon: NotebookPen },
      { to: '/progress', label: 'Progress', icon: Activity },
      { to: '/ask-lolo', label: 'Ask LOLO', icon: Sparkles },
      { to: '/settings', label: 'Settings', icon: Settings },
    ],
  },
];

const navigation = navigationGroups.flatMap((group) => group.items);
const mobileNavigation = navigation.filter(({ to }) => ['/', '/library', '/flashcards', '/practice'].includes(to));

// Keep this origin aligned with index.html, robots.txt, and sitemap.xml.
const productionSiteOrigin = 'https://nursing-with-lolo.netlify.app';

export function AppShell() {
  const { state, updateSettings } = useLearning();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const mainContentRef = useRef<HTMLElement>(null);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileCloseButtonRef = useRef<HTMLButtonElement>(null);
  const previousPathRef = useRef(location.pathname);
  const pageTitle = useMemo(() => {
    const section = navigation.find((item) => item.to !== '/' && location.pathname.startsWith(item.to));
    if (section) return section.label;
    if (location.pathname.startsWith('/lessons/')) {
      const lessonId = decodeURIComponent(location.pathname.slice('/lessons/'.length).split('/')[0]);
      return lessons.find((lesson) => lesson.id === lessonId)?.title ?? 'Lesson';
    }
    return location.pathname === '/' ? 'Dashboard' : 'Page not found';
  }, [location.pathname]);

  const focusMainContent = useCallback(() => {
    const root = document.documentElement;
    const priorScrollBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    root.style.scrollBehavior = priorScrollBehavior;
    mainContentRef.current?.focus({ preventScroll: true });
  }, []);

  const handleDirectNavigation = useCallback((event: ReactMouseEvent<HTMLAnchorElement>, to: string) => {
    // Preserve browser-native open-in-new-tab behavior for modified clicks.
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    setMobileOpen(false);
    setSearchOpen(false);
    if (location.pathname === to) {
      focusMainContent();
      return;
    }
    navigate(to);
  }, [focusMainContent, location.pathname, navigate]);

  useEffect(() => {
    setMobileOpen(false);
    if (previousPathRef.current === location.pathname) return;
    previousPathRef.current = location.pathname;
    const frame = window.requestAnimationFrame(focusMainContent);
    return () => window.cancelAnimationFrame(frame);
  }, [focusMainContent, location.pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const frame = window.requestAnimationFrame(() => mobileCloseButtonRef.current?.focus());
    return () => window.cancelAnimationFrame(frame);
  }, [mobileOpen]);

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
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setSearchOpen(true);
      }
      if (event.key === 'Escape' && mobileOpen) {
        setMobileOpen(false);
        mobileMenuButtonRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [mobileOpen]);

  const dark = document.documentElement.dataset.theme === 'dark';

  return (
    <div className={`app-shell ${collapsed ? 'app-shell--collapsed' : ''}`}>
      <aside id="mobile-study-navigation" className={`sidebar ${mobileOpen ? 'sidebar--open' : ''}`} aria-label="Primary navigation">
        <div className="sidebar__head">
          <Logo compact={collapsed} />
          <button
            ref={mobileCloseButtonRef}
            className="icon-button sidebar__mobile-close"
            onClick={() => { setMobileOpen(false); mobileMenuButtonRef.current?.focus(); }}
            aria-label="Close navigation"
          >
            <X />
          </button>
        </div>
        <div className="sidebar__clinical-icons" aria-hidden="true">
          <HeartPulse /><Pill /><Syringe /><Stethoscope />
        </div>
        <div className="sidebar__study-card">
          <span className="eyebrow">TODAY'S FOCUS</span>
          <strong>Build calm, clinical thinking.</strong>
          {!collapsed && <span>{state.dailyGoalMinutes} minute goal · one step at a time</span>}
        </div>
        <nav className="sidebar__nav" aria-label="All study areas">
          {navigationGroups.map((group) => {
            const labelId = `nav-${group.label.toLowerCase().replaceAll(' ', '-')}`;
            return (
              <section className="sidebar__nav-group" key={group.label} aria-labelledby={labelId}>
                <span className="sidebar__nav-label" id={labelId}>{group.label}</span>
                {group.items.map(({ to, label, icon: Icon, end }) => (
                  <NavLink key={to} to={to} end={end} title={collapsed ? label : undefined} onClick={(event) => handleDirectNavigation(event, to)}>
                    <Icon size={19} aria-hidden="true" /><span>{label}</span>
                  </NavLink>
                ))}
              </section>
            );
          })}
        </nav>
        <div className="sidebar__foot">
          <button onClick={() => setCollapsed((value) => !value)} aria-label={collapsed ? 'Expand navigation' : 'Collapse navigation'}>
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}<span>Collapse</span>
          </button>
          <p><CircleHelp size={15} /> <span>Study aid · verify clinical policy</span></p>
        </div>
      </aside>
      {mobileOpen && (
        <button
          className="mobile-scrim"
          aria-label="Close menu"
          onClick={() => { setMobileOpen(false); mobileMenuButtonRef.current?.focus(); }}
        />
      )}
      <div className="app-main">
        <header className="topbar">
          <div className="topbar__title">
            <button
              ref={mobileMenuButtonRef}
              className="icon-button topbar__menu"
              onClick={() => setMobileOpen(true)}
              aria-label="Open study menu"
              aria-expanded={mobileOpen}
              aria-controls="mobile-study-navigation"
            >
              <Menu />
            </button>
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
        <main ref={mainContentRef} id="main-content" className="page-shell" tabIndex={-1}><Outlet /></main>
        <footer className="site-footer">
          <span><strong>NURSING with LOLO</strong> is an independent study aid, not an accredited program or medical advice.</span>
          <span>Verify current textbooks, instructors, scope, and facility policy.</span>
        </footer>
      </div>
      <nav className="mobile-nav" aria-label="Mobile navigation">
        {mobileNavigation.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} onClick={(event) => handleDirectNavigation(event, to)}>
            <Icon aria-hidden="true" /><span>{label.replace('Lesson ', '')}</span>
          </NavLink>
        ))}
        <button
          className="mobile-nav__more"
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Open all study areas"
          aria-expanded={mobileOpen}
          aria-controls="mobile-study-navigation"
        >
          <Menu aria-hidden="true" /><span>More</span>
        </button>
      </nav>
      <SearchCommand open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
