import { Link } from 'react-router-dom';

export const LogoMark = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
    <rect width="32" height="32" rx="7" className="fill-primary" />
    <path
      d="M9 10.5h14M11.5 10.5V23M20.5 10.5V23"
      className="stroke-primary-fg"
      strokeWidth="2.4"
      strokeLinecap="round"
    />
  </svg>
);

const Logo = ({ to = '/', className = '' }) => (
  <Link to={to} className={`inline-flex items-center gap-2 ${className}`}>
    <LogoMark />
    <span className="text-[15px] font-semibold tracking-tight text-fg">TinyGate</span>
  </Link>
);

export default Logo;
