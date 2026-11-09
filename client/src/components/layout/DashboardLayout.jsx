import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';
import Logo from '../ui/Logo';

const DashboardLayout = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex">
      {/* Desktop sidebar */}
      <div className="hidden lg:block sticky top-0 h-screen border-r border-line">
        <Sidebar />
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden">
          <div className="fixed inset-0 z-40 bg-black/40 animate-fade-in" onClick={() => setOpen(false)} />
          <div className="fixed inset-y-0 left-0 z-50 border-r border-line shadow-pop animate-fade-in">
            <Sidebar onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="lg:hidden h-14 flex items-center gap-3 px-4 border-b border-line bg-surface sticky top-0 z-30">
          <button onClick={() => setOpen(true)} className="icon-btn -ml-1.5" aria-label="Open menu">
            <Menu className="w-5 h-5" />
          </button>
          <Logo to="/dashboard" />
        </header>

        <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-6 lg:py-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
