import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Plus, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { urlAPI } from '../api/url';
import LinksTable, { EmptyState } from '../components/dashboard/LinksTable';
import PageHeader from '../components/ui/PageHeader';
import { isExpired } from '../utils/helpers';

const LIMIT = 20;
const FILTERS = ['all', 'active', 'expired'];

const Links = () => {
  const [urls, setUrls]       = useState([]);
  const [total, setTotal]     = useState(0);
  const [page, setPage]       = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [filter, setFilter]   = useState('all');

  useEffect(() => {
    let cancelled = false;
    urlAPI.getAll({ page, limit: LIMIT })
      .then(({ data }) => {
        if (cancelled) return;
        setUrls(data.data || []);
        setTotal(data.total || 0);
      })
      .catch(() => !cancelled && toast.error('Could not load your links'))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [page]);

  const goTo = (p) => {
    if (p === page) return;
    setLoading(true);
    setPage(p);
  };

  const handleDelete = async (id) => {
    await urlAPI.deleteUrl(id);
    setUrls((prev) => prev.filter((u) => u._id !== id));
    setTotal((t) => t - 1);
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return urls
      .filter((u) => (filter === 'all' ? true : filter === 'expired' ? isExpired(u) : !isExpired(u)))
      .filter((u) => !q || u.originalUrl.toLowerCase().includes(q) || u.shortCode.toLowerCase().includes(q));
  }, [urls, filter, search]);

  const pages = Math.max(1, Math.ceil(total / LIMIT));
  const from  = total === 0 ? 0 : (page - 1) * LIMIT + 1;
  const to    = Math.min(page * LIMIT, total);

  return (
    <div>
      <PageHeader
        title="Links"
        description={`${total} link${total === 1 ? '' : 's'} in your account`}
        actions={
          <Link to="/dashboard" className="btn-primary btn-sm self-start sm:self-auto">
            <Plus className="w-4 h-4" />
            New link
          </Link>
        }
      />

      <div className="flex flex-col sm:flex-row gap-2 mb-3">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-faint pointer-events-none" />
          <input
            type="search"
            placeholder="Search by URL or code"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-9"
            aria-label="Search links"
          />
        </div>
        <div className="segmented self-start" role="group" aria-label="Filter by status">
          {FILTERS.map((f) => (
            <button key={f} type="button" aria-pressed={filter === f} onClick={() => setFilter(f)}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <LinksTable
        urls={filtered}
        loading={loading}
        onDelete={handleDelete}
        skeletonRows={6}
        empty={
          search || filter !== 'all' ? (
            <EmptyState title="No matching links" body="Try a different search term or filter." />
          ) : (
            <EmptyState
              title="No links yet"
              body="Short links you create will show up here."
              action={<Link to="/dashboard" className="btn-secondary btn-sm">Create a link</Link>}
            />
          )
        }
      />

      {total > LIMIT && (
        <div className="flex items-center justify-between mt-3 text-[13px] text-muted">
          <span className="tabular-nums">{from}–{to} of {total}</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => goTo(Math.max(1, page - 1))}
              disabled={page === 1 || loading}
              className="btn-secondary btn-sm px-2"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => goTo(Math.min(pages, page + 1))}
              disabled={page === pages || loading}
              className="btn-secondary btn-sm px-2"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Links;
