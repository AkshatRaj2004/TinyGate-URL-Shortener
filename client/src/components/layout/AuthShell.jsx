import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Logo from '../ui/Logo';

const AuthShell = ({ title, subtitle, children, footer }) => (
  <div className="min-h-screen flex flex-col">
    <header className="h-14 flex items-center px-4 sm:px-6">
      <Logo />
    </header>
    <main className="flex-1 flex items-start sm:items-center justify-center px-4 pt-8 pb-16">
      <div className="w-full max-w-[380px] animate-fade-in">
        <h1 className="text-xl font-semibold tracking-tight text-fg">{title}</h1>
        {subtitle && <p className="text-sm text-muted mt-1">{subtitle}</p>}
        <div className="card p-5 sm:p-6 mt-6 shadow-xs">{children}</div>
        {footer && <p className="text-[13px] text-muted mt-5 text-center">{footer}</p>}
      </div>
    </main>
  </div>
);

export const PasswordInput = ({ id, ...props }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input id={id} type={show ? 'text' : 'password'} className="input pr-10" {...props} />
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        className="absolute right-1 top-1/2 -translate-y-1/2 icon-btn w-7 h-7"
        aria-label={show ? 'Hide password' : 'Show password'}
      >
        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );
};

export default AuthShell;
