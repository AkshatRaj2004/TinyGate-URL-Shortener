import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink, QrCode } from 'lucide-react';
import toast from 'react-hot-toast';
import { urlAPI } from '../api/url';
import ClicksChart from '../components/charts/ClicksChart';
import BreakdownList from '../components/charts/BreakdownList';
import StatsRow from '../components/dashboard/StatCard';
import QRModal from '../components/dashboard/QRModal';
import { StatusPill } from '../components/dashboard/LinksTable';
import CopyButton from '../components/ui/CopyButton';
import { Skeleton } from '../components/ui/Loader';
import {
  displayUrl, formatDate, formatDateTime, formatNumber, shortUrlFor, timeAgo,
} from '../utils/helpers';

const topKey = (obj) => {
  const e = Object.entries(obj || {}).sort(([, a], [, b]) => b - a)[0];
  return e ? e[0] : '—';
};

const clicksInLastDays = (clicksOverTime, days) => {
  const cutoff = new Date();
  cutoff.setUTCHours(0, 0, 0, 0);
  cutoff.setUTCDate(cutoff.getUTCDate() - (days - 1));
  const from = cutoff.toISOString().slice(0, 10);
  return Object.entries(clicksOverTime || {}).reduce((s, [d, n]) => (d >= from ? s + n : s), 0);
};

const Analytics = () => {
  const { id }   = useParams();
  const navigate = useNavigate();
  const [data, setData]   = useState(null);
  const [qrOpen, setQrOpen] = useState(false);

  useEffect(() => {
    urlAPI.getAnalytics(id)
      .then((res) => setData(res.data.data))
      .catch(() => { toast.error('Could not load analytics'); navigate('/dashboard'); });
  }, [id, navigate]);

  const back = (
    <Link to="/dashboard/links" className="inline-flex items-center gap-1.5 text-[13px] text-muted hover:text-fg transition-colors mb-4">
      <ArrowLeft className="w-3.5 h-3.5" />
      Links
    </Link>
  );

  if (!data) {
    return (
      <div>
        {back}
        <Skeleton className="h-6 w-56" />
        <Skeleton className="h-4 w-80 mt-2" />
        <Skeleton className="h-24 w-full mt-8" />
        <Skeleton className="h-72 w-full mt-6" />
      </div>
    );
  }

  const short = shortUrlFor(data);

  const stats = [
    { label: 'Total clicks',  value: formatNumber(data.totalClicks) },
    { label: 'Last 7 days',   value: formatNumber(clicksInLastDays(data.clicksOverTime, 7)) },
    { label: 'Top device',    value: <span className="capitalize">{topKey(data.byDevice)}</span> },
    { label: 'Top browser',   value: topKey(data.byBrowser) },
  ];

  return (
    <div>
      {back}

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start gap-4 mb-8">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="font-mono text-lg sm:text-xl font-medium tracking-tight text-fg break-all">
              {displayUrl(short)}
            </h1>
            <StatusPill url={data} />
          </div>
          <a
            href={data.originalUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-1.5 inline-flex items-center gap-1.5 max-w-full text-sm text-muted hover:text-fg transition-colors"
            title={data.originalUrl}
          >
            <span className="truncate">{displayUrl(data.originalUrl)}</span>
            <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
          </a>
          <p className="text-[13px] text-faint mt-2">
            Created {formatDate(data.createdAt)}
            {data.expiresAt && <> · {new Date(data.expiresAt) > new Date() ? 'Expires' : 'Expired'} {formatDateTime(data.expiresAt)}</>}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <CopyButton value={short} className="btn-secondary btn-sm">Copy</CopyButton>
          <button onClick={() => setQrOpen(true)} className="btn-secondary btn-sm">
            <QrCode className="w-4 h-4" />
            QR code
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <StatsRow items={stats} />

        <section className="card p-4 sm:p-5">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-sm font-medium text-fg">Clicks over time</h2>
            <span className="eyebrow">Daily, UTC</span>
          </div>
          <ClicksChart clicksOverTime={data.clicksOverTime} />
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <BreakdownList title="Devices"  data={data.byDevice} />
          <BreakdownList title="Browsers" data={data.byBrowser} />
          <BreakdownList title="Operating systems" data={data.byOs} />
        </div>

        <section className="card overflow-hidden">
          <div className="px-4 sm:px-5 h-12 flex items-center border-b border-line">
            <h2 className="text-sm font-medium text-fg">Recent clicks</h2>
          </div>
          {data.recentClicks?.length ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[13px]">
                <thead>
                  <tr className="bg-subtle/50 border-b border-line">
                    {['Time', 'Browser', 'OS', 'Device', 'Referrer'].map((h) => (
                      <th key={h} className="px-4 sm:first:pl-5 h-9 eyebrow font-medium whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.recentClicks.map((c, i) => (
                    <tr key={c._id || i} className="border-t border-line first:border-t-0">
                      <td className="px-4 sm:pl-5 py-2.5 text-muted whitespace-nowrap" title={formatDateTime(c.timestamp)}>
                        {timeAgo(c.timestamp)}
                      </td>
                      <td className="px-4 py-2.5 text-fg whitespace-nowrap">{c.browser}</td>
                      <td className="px-4 py-2.5 text-fg whitespace-nowrap">{c.os}</td>
                      <td className="px-4 py-2.5 text-fg whitespace-nowrap capitalize">{c.device}</td>
                      <td className="px-4 py-2.5 text-muted max-w-[220px] truncate">
                        {!c.referrer || c.referrer === 'direct' ? 'Direct' : displayUrl(c.referrer).replace(/\/$/, '')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-[13px] text-faint text-center py-12">
              No clicks yet. Open the short link to record one.
            </p>
          )}
        </section>
      </div>

      <QRModal isOpen={qrOpen} onClose={() => setQrOpen(false)} shortUrl={short} shortCode={data.shortCode} />
    </div>
  );
};

export default Analytics;
