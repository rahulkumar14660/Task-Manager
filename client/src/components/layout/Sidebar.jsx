import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  ListTodo,
  Users,
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';

/**
 * Sidebar navigation with active link highlighting
 */
const Sidebar = () => {
  const { isAdmin } = useAuth();

  const navItems = [
    {
      to: '/dashboard',
      icon: LayoutDashboard,
      label: 'Dashboard',
      end: true,
    },
    {
      to: '/projects',
      icon: FolderKanban,
      label: 'Projects',
    },
    {
      to: '/tasks',
      icon: ListTodo,
      label: 'My Tasks',
    },
  ];

  return (
    <aside
      className="fixed left-0 top-16 bottom-0 w-60 z-30 flex flex-col py-6 px-3 overflow-y-auto"
      style={{
        background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border-color)',
      }}
    >
      {/* Navigation Links */}
      <div className="flex flex-col gap-1">
        <p
          className="text-xs font-semibold uppercase tracking-wider px-3 mb-2"
          style={{ color: 'var(--text-muted)' }}
        >
          Menu
        </p>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 no-underline ${
                isActive ? 'sidebar-active' : 'sidebar-link'
              }`
            }
            style={({ isActive }) => ({
              background: isActive ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
              color: isActive ? 'var(--color-primary)' : 'var(--text-secondary)',
              borderLeft: isActive ? '3px solid var(--color-primary)' : '3px solid transparent',
            })}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>

      {/* Bottom Section */}
      <div className="mt-auto pt-6">
        <div
          className="rounded-lg p-4"
          style={{
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))',
            border: '1px solid rgba(99, 102, 241, 0.2)',
          }}
        >
          <p className="text-xs font-semibold mb-1" style={{ color: 'var(--color-primary)' }}>
            {isAdmin ? '👑 Admin Access' : '👤 Member Access'}
          </p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {isAdmin
              ? 'Full control over projects & tasks'
              : 'View & update your assigned tasks'}
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
