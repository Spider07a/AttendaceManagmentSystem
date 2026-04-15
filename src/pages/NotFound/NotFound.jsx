import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import { AlertTriangle } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-center" style={{ height: '100vh', flexDirection: 'column', background: 'radial-gradient(circle at center, var(--bg-secondary) 0%, var(--bg-primary) 100%)', textAlign: 'center', padding: '2rem' }}>
      <AlertTriangle size={64} style={{ color: 'var(--error)', marginBottom: '1.5rem' }} />
      <h1 className="text-gradient" style={{ fontSize: '4rem', fontWeight: 800, marginBottom: '0.5rem' }}>404</h1>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Page Not Found</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: '400px' }}>
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Button onClick={() => navigate('/login')}>Return to Safety</Button>
    </div>
  );
};

export default NotFound;
