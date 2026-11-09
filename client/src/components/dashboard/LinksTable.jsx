import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, Globe, QrCode, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import CopyButton from '../ui/CopyButton';
import Modal from '../ui/Modal';
import { Skeleton } from '../ui/Loader';
import QRModal from './QRModal';
import {
  displayUrl, formatNumber, getDomain, isExpired, shortUrlFor, timeAgo, formatDate,
} from '../../utils/helpers';

const Favicon = ({ url }) => {
  const [failed, setFailed] = useState(false);
  if (failed) return <Globe className="w-3.5 h-3.5 text-faint flex-shrink-0" />;
  return (
    <img
      src={`https://www.google.com/s2/favicons?domain=${getDomain(url)}&sz=32`}
      alt=""
      className="w-3.5 h-3.5 rounded-sm flex-shrink-0"
      onError={() => setFailed(true)}
    />
  );
};

export const StatusPill = ({ url }) => {
  const expired = isExpired(url);
  return (
    <span className="inline-flex items-center gap-1.5 text-[13px] text-muted whitespace-nowrap">
      <span className={`w-1.5 h-1.5 rounded-full ${expired ? 'bg-faint' : 'bg-success'}`} />
      {expired ? 'Expired' : 'Active'}
    </span>
  );
};

const Row = ({ url, onAskDelete, onShowQr }) => {
  const short = shortUrlFor(url);
  return (
    <tr className="group border-t border-line first:border-t-0 hover:bg-subtle/40 transition-colors">
      <td className="pl-4 sm:pl-5 pr-3 py-3 max-w-0 w-full">
        <div className="flex items-center gap-2 min-w-0">
          <Link
            to={`/dashboard/analytics/${url._id}`}
            className="font-mono text-[13px] font-medium text-fg truncate hover:underline underline-offset-4"
            title={short}
          >
            <span className="hidden sm:inline text-muted font-normal">
              {displayUrl(short).slice(0, -(url.shortCode.length + 1))}
            </span>
            /{url.shortCode}
          </Link>
        </div>
        <div className="flex items-center gap-1.5 mt-1 min-w-0">
          <Favicon url={url.originalUrl} />
          <span className="text-[13px] text-muted truncate" title={url.originalUrl}>
            {displayUrl(url.originalUrl)}
          </span>
        </div>
      </td>
      <td className="px-3 py-3 text-right tabular-nums text-sm text-fg whitespace-nowrap">
        {formatNumber(url.clicks)}
      </td>
      <td className="px-3 py-3 hidden md:table-cell whitespace-nowrap text-[13px] text-muted" title={formatDate(url.createdAt)}>
        {timeAgo(url.createdAt)}
      </td>
      <td className="px-3 py-3 hidden sm:table-cell">
        <StatusPill url={url} />
      </td>
      <td className="pl-1 pr-2 sm:pr-3 py-3">
        <div className="flex items-center justify-end">
          <CopyButton value={short} />
          <button onClick={() => onShowQr(url)} className="icon-btn hidden sm:inline-flex" title="QR code" aria-label="QR code">
            <QrCode className="w-4 h-4" />
          </button>
          <Link to={`/dashboard/analytics/${url._id}`} className="icon-btn" title="Analytics" aria-label="Analytics">
            <BarChart3 className="w-4 h-4" />
          </Link>
          <button
            onClick={() => onAskDelete(url)}
            className="icon-btn hover:!text-danger"
            title="Delete"
            aria-label="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

const LinksTable = ({ urls, loading, onDelete, empty, skeletonRows = 4 }) => {
  const [qrFor, setQrFor]         = useState(null);
  const [deleteFor, setDeleteFor] = useState(null);
  const [deleting, setDeleting]   = useState(false);

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await onDelete(deleteFor._id);
      toast.success('Link deleted');
      setDeleteFor(null);
    } catch {
      toast.error('Could not delete link');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="card overflow-hidden">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-line bg-subtle/50">
            <th className="pl-4 sm:pl-5 pr-3 h-9 eyebrow font-medium">Link</th>
            <th className="px-3 h-9 eyebrow font-medium text-right">Clicks</th>
            <th className="px-3 h-9 eyebrow font-medium hidden md:table-cell">Created</th>
            <th className="px-3 h-9 eyebrow font-medium hidden sm:table-cell">Status</th>
            <th className="pr-3 h-9"><span className="sr-only">Actions</span></th>
          </tr>
        </thead>
        <tbody>
          {loading
            ? Array.from({ length: skeletonRows }).map((_, i) => (
                <tr key={i} className="border-t border-line first:border-t-0">
                  <td className="pl-5 pr-3 py-3.5" colSpan={5}>
                    <Skeleton className="h-3.5 w-40" />
                    <Skeleton className="h-3 w-64 mt-2" />
                  </td>
                </tr>
              ))
            : urls.map((u) => (
                <Row key={u._id} url={u} onAskDelete={setDeleteFor} onShowQr={setQrFor} />
              ))}
        </tbody>
      </table>

      {!loading && urls.length === 0 && empty}

      <QRModal
        isOpen={!!qrFor}
        onClose={() => setQrFor(null)}
        shortUrl={qrFor ? shortUrlFor(qrFor) : ''}
        shortCode={qrFor?.shortCode}
      />

      <Modal
        isOpen={!!deleteFor}
        onClose={() => !deleting && setDeleteFor(null)}
        title="Delete link?"
        description="The short link will stop redirecting and its analytics will be removed. This can’t be undone."
      >
        {deleteFor && (
          <p className="font-mono text-[13px] px-3 py-2 rounded-md bg-subtle border border-line truncate">
            {displayUrl(shortUrlFor(deleteFor))}
          </p>
        )}
        <div className="flex justify-end gap-2 mt-5">
          <button onClick={() => setDeleteFor(null)} disabled={deleting} className="btn-secondary">Cancel</button>
          <button onClick={confirmDelete} disabled={deleting} className="btn-danger">
            {deleting ? 'Deleting…' : 'Delete link'}
          </button>
        </div>
      </Modal>
    </div>
  );
};

/** Centered empty-state block for use inside LinksTable's `empty` prop. */
export const EmptyState = ({ title, body, action }) => (
  <div className="flex flex-col items-center text-center px-6 py-14">
    <p className="text-sm font-medium text-fg">{title}</p>
    {body && <p className="text-[13px] text-muted mt-1 max-w-sm">{body}</p>}
    {action && <div className="mt-4">{action}</div>}
  </div>
);

export default LinksTable;
