import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import toast from 'react-hot-toast';
import { copyToClipboard } from '../../utils/helpers';

/** Icon button that copies `value` and briefly shows a check mark. */
const CopyButton = ({ value, label = 'Copy link', className = 'icon-btn', children }) => {
  const [copied, setCopied] = useState(false);

  const onClick = async (e) => {
    e.stopPropagation();
    if (await copyToClipboard(value)) {
      setCopied(true);
      toast.success('Copied to clipboard');
      setTimeout(() => setCopied(false), 1500);
    } else {
      toast.error('Could not copy');
    }
  };

  const Icon = copied ? Check : Copy;
  return (
    <button type="button" onClick={onClick} className={className} title={label} aria-label={label}>
      <Icon className={`w-4 h-4 ${copied ? 'text-success' : ''}`} />
      {children}
    </button>
  );
};

export default CopyButton;
