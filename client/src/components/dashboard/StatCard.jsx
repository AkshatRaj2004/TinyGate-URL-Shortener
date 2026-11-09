import { Skeleton } from '../ui/Loader';

/**
 * A single bordered strip of metrics, divided into cells.
 * items: [{ label, value, hint? }]
 */
export const StatsRow = ({ items, loading }) => (
  <div className="card grid grid-cols-2 lg:grid-cols-4 [&>*]:border-line">
    {items.map((s, i) => (
      <div
        key={s.label}
        className={`p-4 sm:p-5 ${i % 2 === 1 ? 'border-l' : ''} ${i >= 2 ? 'border-t lg:border-t-0' : ''} ${i === 2 ? 'lg:border-l' : ''}`}
      >
        <p className="text-[13px] text-muted">{s.label}</p>
        {loading ? (
          <Skeleton className="h-7 w-16 mt-1.5" />
        ) : (
          <p className="mt-1 text-2xl font-semibold tracking-tight tabular-nums text-fg">{s.value}</p>
        )}
        {s.hint && <p className="text-2xs text-faint mt-1">{s.hint}</p>}
      </div>
    ))}
  </div>
);

export default StatsRow;
