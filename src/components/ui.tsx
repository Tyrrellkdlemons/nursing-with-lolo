import type { ReactNode } from 'react';

export function PageHeader({ eyebrow, title, description, actions }: { eyebrow?: string; title: string; description: string; actions?: ReactNode }) {
  return (
    <header className="page-header">
      <div>{eyebrow && <span className="eyebrow">{eyebrow}</span>}<h1>{title}</h1><p>{description}</p></div>
      {actions && <div className="page-header__actions">{actions}</div>}
    </header>
  );
}

export function ProgressRing({ value, label, size = 76 }: { value: number; label: string; size?: number }) {
  const safe = Math.min(100, Math.max(0, value));
  return (
    <div className="progress-ring" style={{ '--progress': `${safe * 3.6}deg`, '--ring-size': `${size}px` } as React.CSSProperties} role="img" aria-label={`${label}: ${safe}%`}>
      <span><strong>{safe}%</strong><small>{label}</small></span>
    </div>
  );
}

export function Meter({ value, max = 100, label }: { value: number; max?: number; label: string }) {
  const percent = max ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return <div className="meter"><div className="meter__label"><span>{label}</span><strong>{percent}%</strong></div><div className="meter__track"><span style={{ width: `${percent}%` }} /></div></div>;
}

export function EmptyState({ icon, title, body, action }: { icon: ReactNode; title: string; body: string; action?: ReactNode }) {
  return <div className="empty-state">{icon}<h3>{title}</h3><p>{body}</p>{action}</div>;
}

