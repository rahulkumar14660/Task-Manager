import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const DashboardLayout = () => {
  return (
    <div className="bg-[var(--bg-primary)] min-h-screen">

      {/* Navbar */}
      <Navbar />

      {/* Layout */}
      <div className="flex mt-16">

        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 pl-14 pr-10 pt-10 pb-10">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  );
};

export default DashboardLayout;