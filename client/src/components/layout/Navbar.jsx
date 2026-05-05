import { Link } from 'react-router-dom';
import { LogOut, CheckSquare } from 'lucide-react';
import useAuth from '../../hooks/useAuth';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();

  return (
    <nav className="h-16 flex items-center justify-between px-10 border-b border-slate-800 bg-[#0f172a]/90 backdrop-blur-md">

      {/* Left */}
      <Link to="/dashboard" className="flex items-center gap-3">
        <div className="w-9 h-9 bg-indigo-500 rounded-lg flex items-center justify-center">
          <CheckSquare size={18} className="text-white" />
        </div>
        <span className="font-semibold text-lg text-white">TaskFlow</span>
      </Link>

      {/* Right */}
      <div className="flex items-center gap-6">

        {/* Role Badge */}
        <span className="px-3 py-1 text-xs rounded-full bg-indigo-500/10 text-indigo-400">
          {isAdmin ? 'ADMIN' : 'MEMBER'}
        </span>

        {/* User Info */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center text-white text-sm font-semibold">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>

          <div className="text-sm hidden md:block">
            <p className="text-white font-medium">
              {user?.name || 'User'}
            </p>
            <p className="text-slate-400 text-xs">
              {user?.email || 'user@email.com'}
            </p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition"
        >
          <LogOut size={18} />
          <span className="hidden sm:inline text-sm">Logout</span>
        </button>

      </div>
    </nav>
  );
};

export default Navbar;