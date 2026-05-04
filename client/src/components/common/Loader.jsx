import { Loader2 } from 'lucide-react';

/**
 * Loading spinner component — full page or inline
 */
const Loader = ({ fullPage = false, text = 'Loading...' }) => {
  if (fullPage) {
    return (
      <div
        className="fixed inset-0 flex flex-col items-center justify-center z-50"
        style={{ background: 'var(--bg-primary)' }}
      >
        <div className="animate-pulse-glow rounded-full p-4 mb-4" style={{ background: 'var(--bg-secondary)' }}>
          <Loader2 size={40} className="animate-spin" style={{ color: 'var(--color-primary)' }} />
        </div>
        <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
          {text}
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      <Loader2 size={28} className="animate-spin mr-2" style={{ color: 'var(--color-primary)' }} />
      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
        {text}
      </span>
    </div>
  );
};

export default Loader;
