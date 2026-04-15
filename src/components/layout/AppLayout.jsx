import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, LayoutDashboard, UserPlus, FileText, CalendarCheck } from 'lucide-react';

const AppLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavItems = (role) => {
    switch(role) {
      case 'admin':
        return [{ label: 'Admin Console', path: '/admin', icon: <LayoutDashboard size={20} /> }];
      case 'hod':
        return [{ label: 'HOD Dashboard', path: '/hod', icon: <LayoutDashboard size={20} /> }];
      case 'faculty':
        return [{ label: 'Classes & Registers', path: '/faculty', icon: <FileText size={20} /> }];
      case 'student':
        return [{ label: 'My Attendance', path: '/student', icon: <CalendarCheck size={20} /> }];
      default:
        return [];
    }
  };
  const navItems = getNavItems(user?.role);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
      {/* Sidebar */}
      <aside style={{
        width: '260px',
        background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
          <h2 className="text-gradient" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>AMS Portal</h2>
        </div>
        
        <nav style={{ flex: 1, padding: '1rem' }}>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <button
                    onClick={() => navigate(item.path)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      background: isActive ? 'var(--accent-gradient)' : 'transparent',
                      color: isActive ? '#fff' : 'var(--text-secondary)',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontFamily: 'inherit',
                      fontSize: '1rem',
                      transition: 'all 0.2s ease',
                      boxShadow: isActive ? 'var(--shadow-glow)' : 'none'
                    }}
                    onMouseEnter={(e) => !isActive && (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                    onMouseLeave={(e) => !isActive && (e.currentTarget.style.background = 'transparent')}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div style={{ padding: '1rem', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ marginBottom: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            <div>Logged in as:</div>
            <div style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{user?.name}</div>
          </div>
          <button 
            className="btn btn-secondary" 
            style={{ width: '100%', justifyContent: 'flex-start' }}
            onClick={handleLogout}
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        <div className="animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto' }}>
           <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
