import React from 'react';
import { Loader2 } from 'lucide-react';

const Spinner = ({ text = "Loading..." }) => {
  return (
    <div className="flex-center" style={{ height: '100%', minHeight: '300px', flexDirection: 'column', gap: '1rem', color: 'var(--text-secondary)' }}>
      <Loader2 size={48} className="animate-spin" style={{ animation: 'spin 1s linear infinite', color: 'var(--accent-primary)' }} />
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
      <p>{text}</p>
    </div>
  );
};

export default Spinner;
