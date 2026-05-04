import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

/**
 * Dashboard layout with Navbar, Sidebar, and main content area
 */
const DashboardLayout = () => {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <Navbar />
      <Sidebar />

      {/* Main Content Area */}
      <main
        className="ml-60 mt-16 p-6 min-h-[calc(100vh-4rem)]"
        style={{ background: 'var(--bg-primary)' }}
      >
        <div className="max-w-7xl mx-auto animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
