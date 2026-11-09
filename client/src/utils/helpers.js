// ── Date formatting ───────────────────────────────────────────────────────────
export const formatDate = (date) => {
  if (!date) return '—';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  }).format(new Date(date));
};

export const formatDateTime = (date) => {
  if (!date) return '—';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date(date));
};

export const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  const intervals = [
    [31536000, 'year'], [2592000, 'month'], [86400, 'day'],
    [3600, 'hour'],     [60, 'minute'],     [1, 'second'],
  ];
  for (const [secs, label] of intervals) {
    const count = Math.floor(seconds / secs);
    if (count >= 1) return `${count} ${label}${count !== 1 ? 's' : ''} ago`;
  }
  return 'just now';
};

// ── Clipboard ─────────────────────────────────────────────────────────────────
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    const el = document.createElement('textarea');
    el.value = text;
    el.style.position = 'fixed';
    el.style.opacity = '0';
    document.body.appendChild(el);
    el.focus();
    el.select();
    const success = document.execCommand('copy');
    document.body.removeChild(el);
    return success;
  }
};

// ── URL helpers ───────────────────────────────────────────────────────────────
export const truncateUrl = (url, maxLen = 55) => {
  if (!url) return '';
  return url.length > maxLen ? url.slice(0, maxLen) + '…' : url;
};

export const getDomain = (url) => {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return url;
  }
};

// ── Number formatting ─────────────────────────────────────────────────────────
export const formatNumber = (n) => {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000)     return (n / 1_000).toFixed(1) + 'K';
  return String(n ?? 0);
};

// ── Short URL ────────────────────────────────────────────────────────────────
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/** Prefer the server-provided shortUrl (built from BASE_URL); fall back to the API host. */
export const shortUrlFor = (url) => url?.shortUrl || `${API_BASE}/${url?.shortCode}`;

/** "http://localhost:5000/abc" → "localhost:5000/abc" for display. */
export const displayUrl = (url) => (url || '').replace(/^https?:\/\//, '');

export const isExpired = (url) => !!url?.expiresAt && new Date(url.expiresAt) <= new Date();

// ── Theme colours for canvas-based charts ────────────────────────────────────
/** Reads a CSS token such as --accent ("37 99 235") and returns "rgba(37, 99, 235, a)". */
export const cssColor = (name, alpha = 1) => {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(`--${name}`).trim();
  const [r, g, b] = raw.split(/\s+/);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
