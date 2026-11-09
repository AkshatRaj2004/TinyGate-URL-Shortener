import { useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Download } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../ui/Modal';
import CopyButton from '../ui/CopyButton';
import { displayUrl } from '../../utils/helpers';

const QRModal = ({ isOpen, onClose, shortUrl, shortCode }) => {
  const wrapRef = useRef(null);

  const handleDownload = () => {
    const canvas = wrapRef.current?.querySelector('canvas');
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `tinygate-${shortCode || 'qr'}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    toast.success('QR code downloaded');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="QR code" maxWidth="max-w-xs">
      <div className="flex flex-col items-center gap-4">
        <div ref={wrapRef} className="p-3 rounded-md bg-white border border-line">
          <QRCodeCanvas value={shortUrl || ''} size={192} bgColor="#ffffff" fgColor="#18181b" level="M" marginSize={0} />
        </div>

        <div className="w-full flex items-center gap-2 h-9 pl-3 pr-0.5 rounded-md border border-line bg-subtle">
          <span className="flex-1 font-mono text-[13px] text-fg truncate">{displayUrl(shortUrl)}</span>
          <CopyButton value={shortUrl} />
        </div>

        <button onClick={handleDownload} className="btn-primary w-full">
          <Download className="w-4 h-4" />
          Download PNG
        </button>
      </div>
    </Modal>
  );
};

export default QRModal;
