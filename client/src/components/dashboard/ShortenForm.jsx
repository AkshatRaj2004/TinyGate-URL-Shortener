import { useState } from 'react';
import { ChevronDown, ExternalLink, Link2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { urlAPI } from '../../api/url';
import { Spinner } from '../ui/Loader';
import CopyButton from '../ui/CopyButton';
import { shortUrlFor, displayUrl } from '../../utils/helpers';

const toLocalInputValue = (d) => {
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const ShortenForm = ({ onCreated }) => {
  const [url, setUrl]           = useState('');
  const [alias, setAlias]       = useState('');
  const [expiry, setExpiry]     = useState('');
  const [advanced, setAdvanced] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [created, setCreated]   = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;
    setLoading(true);
    try {
      const payload = { originalUrl: url.trim() };
      if (alias.trim()) payload.customAlias = alias.trim();
      // datetime-local has no timezone; convert from the user's local time to ISO.
      if (expiry) payload.expiresAt = new Date(expiry).toISOString();

      const { data } = await urlAPI.shorten(payload);
      setCreated(data.data);
      onCreated?.(data.data);
      setUrl(''); setAlias(''); setExpiry('');
      toast.success('Short link created');
    } catch (err) {
      const res = err.response?.data;
      toast.error(res?.errors?.[0]?.message || res?.message || 'Could not shorten that URL');
    } finally {
      setLoading(false);
    }
  };

  const createdUrl = created && shortUrlFor(created);

  return (
    <section className="card">
      <form onSubmit={handleSubmit} className="p-4 sm:p-5">
        <label htmlFor="long-url" className="label">Destination URL</label>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-faint pointer-events-none" />
            <input
              id="long-url"
              type="url"
              placeholder="https://example.com/a/very/long/path"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              className="input pl-9"
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary sm:w-28">
            {loading ? <Spinner size="sm" className="!text-primary-fg" /> : 'Shorten'}
          </button>
        </div>

        <button
          type="button"
          onClick={() => setAdvanced((v) => !v)}
          className="mt-3 inline-flex items-center gap-1 text-[13px] text-muted hover:text-fg transition-colors"
          aria-expanded={advanced}
        >
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${advanced ? 'rotate-180' : ''}`} />
          Custom alias &amp; expiry
        </button>

        {advanced && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 animate-fade-in">
            <div>
              <label htmlFor="alias" className="label">Alias <span className="text-faint font-normal">optional</span></label>
              <div className="flex rounded-md shadow-xs">
                <span className="inline-flex items-center px-2.5 rounded-l-md border border-r-0 border-line bg-subtle text-[13px] text-muted font-mono">
                  /
                </span>
                <input
                  id="alias"
                  type="text"
                  placeholder="launch-2026"
                  value={alias}
                  onChange={(e) => setAlias(e.target.value)}
                  pattern="[a-zA-Z0-9_\-]{3,30}"
                  title="3–30 letters, numbers, hyphens or underscores"
                  className="input rounded-l-none shadow-none font-mono"
                />
              </div>
            </div>
            <div>
              <label htmlFor="expiry" className="label">Expires <span className="text-faint font-normal">optional</span></label>
              <input
                id="expiry"
                type="datetime-local"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                min={toLocalInputValue(new Date())}
                className="input"
              />
            </div>
          </div>
        )}
      </form>

      {created && (
        <div className="flex items-center gap-3 px-4 sm:px-5 py-3 border-t border-line bg-subtle/50 rounded-b-lg animate-fade-in">
          <span className="w-1.5 h-1.5 rounded-full bg-success flex-shrink-0" />
          <a
            href={createdUrl}
            target="_blank"
            rel="noreferrer"
            className="font-mono text-[13px] text-fg truncate hover:underline underline-offset-4"
          >
            {displayUrl(createdUrl)}
          </a>
          <div className="ml-auto flex items-center">
            <CopyButton value={createdUrl} />
            <a href={createdUrl} target="_blank" rel="noreferrer" className="icon-btn" title="Open" aria-label="Open link">
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}
    </section>
  );
};

export default ShortenForm;
