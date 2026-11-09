/**
 * Ranked list with proportional bars — reads better than a doughnut for
 * small categorical breakdowns (device, browser, OS).
 */
const BreakdownList = ({ title, data = {}, limit = 6 }) => {
  const entries = Object.entries(data || {}).sort(([, a], [, b]) => b - a);
  const total = entries.reduce((s, [, v]) => s + v, 0);
  const shown = entries.slice(0, limit);
  const rest = entries.slice(limit).reduce((s, [, v]) => s + v, 0);
  if (rest > 0) shown.push(['Other', rest]);

  return (
    <section className="card p-4 sm:p-5">
      <div className="flex items-baseline justify-between mb-4">
        <h3 className="text-sm font-medium text-fg">{title}</h3>
        <span className="eyebrow">Clicks</span>
      </div>

      {shown.length === 0 ? (
        <p className="text-[13px] text-faint py-6 text-center">No data yet</p>
      ) : (
        <ul className="space-y-1.5">
          {shown.map(([label, value]) => {
            const pct = total ? (value / total) * 100 : 0;
            return (
              <li key={label} className="relative h-8 flex items-center px-2.5 rounded">
                <div
                  className="absolute inset-y-0 left-0 rounded bg-accent/10"
                  style={{ width: `${Math.max(pct, 2)}%` }}
                />
                <span className="relative flex-1 text-[13px] text-fg capitalize truncate">{label}</span>
                <span className="relative text-[13px] tabular-nums text-fg ml-3">{value}</span>
                <span className="relative text-2xs tabular-nums text-muted w-10 text-right">
                  {pct.toFixed(0)}%
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
};

export default BreakdownList;
