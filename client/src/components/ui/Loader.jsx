import { Loader2 } from 'lucide-react';

export const Spinner = ({ size = 'md', className = '' }) => {
  const sizes = { sm: 'w-4 h-4', md: 'w-5 h-5', lg: 'w-6 h-6', xl: 'w-8 h-8' };
  return <Loader2 className={`${sizes[size]} animate-spin text-faint ${className}`} aria-label="Loading" />;
};

export const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Spinner size="lg" />
  </div>
);

/** Grey placeholder block for loading states. */
export const Skeleton = ({ className = '' }) => (
  <div className={`rounded bg-subtle animate-pulse ${className}`} />
);
