import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  ListTodo,
  Menu,
  X,
} from 'lucide-react';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/projects', icon: FolderKanban, label: 'Projects' },
    { to: '/tasks', icon: ListTodo, label: 'My Tasks' },
  ];

  return (
    <>
      {/* Mobile Toggle */}
      <div className="md:hidden p-3 border-b border-slate-800">
        <button onClick={() => setMobileOpen(true)}>
          <Menu className="text-white" />
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`
          fixed md:relative z-50 h-full bg-[#0f172a]/95 backdrop-blur-xl border-r border-slate-800
          transition-all duration-300
          ${collapsed ? 'w-20' : 'w-64'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          {!collapsed && (
            <span className="text-white font-semibold text-lg">
              Menu
            </span>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:block text-slate-400 hover:text-white"
          >
            {collapsed ? '»' : '«'}
          </button>

          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden text-white"
          >
            <X />
          </button>
        </div>

        {/* Nav */}
        <div className="mt-6 px-3 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-indigo-500/10 text-indigo-400 shadow'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <item.icon size={20} />
              {!collapsed && (
                <span className="text-sm font-medium">
                  {item.label}
                </span>
              )}
            </NavLink>
          ))}
        </div>
      </aside>

      {/* Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;