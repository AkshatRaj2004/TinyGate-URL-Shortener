import { Link } from 'react-router-dom';
import Logo from '../components/ui/Logo';

const NotFound = () => (
  <div className="min-h-screen flex flex-col">
    <header className="h-14 flex items-center px-4 sm:px-6">
      <Logo />
    </header>
    <main className="flex-1 flex items-center justify-center px-4 pb-20">
      <div className="text-center">
        <p className="font-mono text-[13px] text-muted">404</p>
        <h1 className="text-xl font-semibold tracking-tight mt-2">This page doesn’t exist</h1>
        <p className="text-sm text-muted mt-2 max-w-xs mx-auto">
          The address may be mistyped, or the short link was deleted or has expired.
        </p>
        <Link to="/" className="btn-secondary mt-6">Back to home</Link>
      </div>
    </main>
  </div>
);

export default NotFound;
