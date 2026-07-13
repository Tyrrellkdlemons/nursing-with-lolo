import { Link } from 'react-router-dom';

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link className={`brand ${compact ? 'brand--compact' : ''}`} to="/" aria-label="NURSING with LOLO home">
      <span className="brand__mark" aria-hidden="true">
        <svg viewBox="0 0 64 64" role="img">
          <path className="brand__monogram" d="M17 14h10l17 29V14h10v39H44L27 25v28H17z" />
          <path className="brand__pulse" d="M5 37h14l4-10 7 22 8-17 5 10h16" />
          <path className="brand__cross" d="M51 7v10M46 12h10" />
          <path className="brand__stethoscope" d="M12 15v7a6 6 0 0 0 12 0v-7M18 28v3" />
          <circle className="brand__stethoscope" cx="18" cy="34" r="3" />
          <circle className="brand__sparkle" cx="9" cy="50" r="1.5" />
        </svg>
      </span>
      {!compact && <span className="brand__word"><strong>NURSING</strong><em>with LOLO</em></span>}
    </Link>
  );
}
