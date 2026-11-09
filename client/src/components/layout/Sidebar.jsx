import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutGrid, Link2, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Logo from '../ui/Logo';
import toast from 'react-hot-toast';

const NAV = [
  { label: 'Overview', to: '/dashboard',       icon: LayoutGrid, end: true },
  { label: 'Links',    to: '/dashboard/links', icon: Link2 },
];

const Sidebar = ({ onNavigate }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Signed out');
    navigate('/');
  };

  const initials = (user?.name || 'U')
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <aside className="flex flex-col h-full w-60 bg-surface">
      <div className="h-14 flex items-center px-4 border-b border-line">
        <Logo to="/dashboard" />
      </div>

      <nav className="flex-1 p-2 space-y-0.5">
        {NAV.map(({ label, to, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-2.5 h-8 px-2.5 rounded-md text-sm transition-colors ${
                isActive
                  ? 'bg-subtle text-fg font-medium'
                  : 'text-muted hover:text-fg hover:bg-subtle/60'
              }`
            }
          >
            <Icon className="w-4 h-4" strokeWidth={1.75} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-2 border-t border-line">
        <div className="flex items-center gap-2.5 p-2">
          <div className="w-7 h-7 rounded-full bg-subtle border border-line flex items-center justify-center text-2xs font-semibold text-muted flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-medium text-fg truncate leading-tight">{user?.name}</p>
            <p className="text-2xs text-muted truncate">{user?.email}</p>
          </div>
          <button onClick={handleLogout} className="icon-btn w-7 h-7" title="Sign out" aria-label="Sign out">
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
