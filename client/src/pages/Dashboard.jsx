import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { urlAPI } from '../api/url';
import { useAuth } from '../context/AuthContext';
import ShortenForm from '../components/dashboard/ShortenForm';
import StatsRow from '../components/dashboard/StatCard';
import LinksTable, { EmptyState } from '../components/dashboard/LinksTable';
import PageHeader from '../components/ui/PageHeader';
import { formatNumber, isExpired } from '../utils/helpers';

const RECENT = 5;

const Dashboard = () => {
  const { user } = useAuth();
  const [urls, setUrls]       = useState([]);
  const [total, setTotal]     = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    urlAPI.getAll({ limit: 50 })
      .then(({ data }) => { setUrls(data.data || []); setTotal(data.total || 0); })
      .catch(() => toast.error('Could not load your links'))
      .finally(() => setLoading(false));
  }, []);

  const handleCreated = (u) => { setUrls((prev) => [u, ...prev]); setTotal((t) => t + 1); };
  const handleDelete = async (id) => {
    await urlAPI.deleteUrl(id);
    setUrls((prev) => prev.filter((u) => u._id !== id));
    setTotal((t) => t - 1);
  };

  const stats = useMemo(() => {
    const clicks  = urls.reduce((s, u) => s + (u.clicks || 0), 0);
    const expired = urls.filter(isExpired).length;
    const top     = urls.reduce((best, u) => ((u.clicks || 0) > (best?.clicks || 0) ? u : best), null);
    return [
      { label: 'Links',        value: formatNumber(total) },
      { label: 'Total clicks', value: formatNumber(clicks) },
      { label: 'Active',       value: formatNumber(urls.length - expired) },
      { label: 'Top link',     value: top ? formatNumber(top.clicks) : '—', hint: top ? `/${top.shortCode}` : 'No clicks yet' },
    ];
  }, [urls, total]);

  const firstName = user?.name?.split(' ')[0];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Overview"
        description={firstName ? `Signed in as ${firstName}. Create a link or check how your links are doing.` : undefined}
      />

      <StatsRow items={stats} loading={loading} />

      <ShortenForm onCreated={handleCreated} />

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium text-fg">Recent links</h2>
          {total > RECENT && (
            <Link to="/dashboard/links" className="inline-flex items-center gap-1 text-[13px] text-muted hover:text-fg transition-colors">
              View all {total}
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
        <LinksTable
          urls={urls.slice(0, RECENT)}
          loading={loading}
          onDelete={handleDelete}
          skeletonRows={3}
          empty={
            <EmptyState
              title="No links yet"
              body="Paste a URL in the form above to create your first short link."
            />
          }
        />
      </section>
    </div>
  );
};

export default Dashboard;
