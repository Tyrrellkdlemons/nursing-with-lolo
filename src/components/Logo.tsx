import { Link } from 'react-router-dom';

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link className={`brand ${compact ? 'brand--compact' : ''}`} to="/" aria-label="NURSING with LOLO home">
      <span className="brand__mark" aria-hidden="true">
        <svg viewBox="0 0 48 48" role="img">
          <path d="M10 9h8l13 22V9h8v30h-8L18 18v21h-8z" />
          <path className="brand__pulse" d="M4 26h10l3-7 5 16 5-11 4 7h13" />
        </svg>
      </span>
      {!compact && <span className="brand__word"><strong>NURSING</strong><em>with LOLO</em></span>}
    </Link>
  );
}

