import { Link } from 'react-router-dom';
import { LogOut, User, CheckSquare } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import { getInitials } from '../../utils/helpers';

/**
 * Top navigation bar with user info and logout
 */
const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-40 h-16 flex items-center justify-between px-6"
      style={{
        background: 'rgba(15, 23, 42, 0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-color)',
      }}
    >
      {/* Logo */}
      <Link to="/dashboard" className="flex items-center gap-2.5 no-underline">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center gradient-primary"
        >
          <CheckSquare size={20} color="white" />
        </div>
        <span
          className="text-lg font-bold"
          style={{ color: 'var(--text-primary)' }}
        >
          TaskFlow
        </span>
      </Link>

      {/* User Section */}
      <div className="flex items-center gap-4">
        {/* Role Badge */}
        <span className={`badge ${isAdmin ? 'badge-admin' : 'badge-member'}`}>
          {user?.role}
        </span>

        {/* User Info */}
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
            style={{
              background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
              color: 'white',
            }}
          >
            {getInitials(user?.name)}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium leading-tight" style={{ color: 'var(--text-primary)' }}>
              {user?.name}
            </p>
            <p className="text-xs leading-tight" style={{ color: 'var(--text-muted)' }}>
              {user?.email}
            </p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          className="btn btn-ghost btn-sm"
          title="Logout"
        >
          <LogOut size={18} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
