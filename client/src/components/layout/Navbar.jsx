import { Link } from 'react-router-dom';
import { LogOut, CheckSquare } from 'lucide-react';
import useAuth from '../../hooks/useAuth';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();

  return (
    <nav className="h-16 flex items-center justify-between px-8 border-b border-slate-800 bg-[#0f172a]/80 backdrop-blur-xl sticky top-0 z-50">

      {/* Logo */}
      <Link to="/dashboard" className="flex items-center gap-3">
        <div className="w-9 h-9 bg-indigo-500 rounded-lg flex items-center justify-center shadow-md">
          <CheckSquare size={18} className="text-white" />
        </div>
        <span className="font-semibold text-lg text-white tracking-wide">
          TaskFlow
        </span>
      </Link>

      {/* Right */}
      <div className="flex items-center gap-6">

        <span className="px-3 py-1 text-xs rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          {isAdmin ? 'ADMIN' : 'MEMBER'}
        </span>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center text-white text-sm font-semibold shadow">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>

          <div className="hidden md:block">
            <p className="text-white text-sm font-medium leading-tight">
              {user?.name}
            </p>
            <p className="text-slate-400 text-xs">
              {user?.email}
            </p>
          </div>
        </div>

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