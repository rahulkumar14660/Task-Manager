import { Routes, Route, Navigate } from 'react-router-dom';

// Pages
import Login from '../pages/auth/Login';
import Signup from '../pages/auth/Signup';
import Dashboard from '../pages/dashboard/Dashboard';
import Projects from '../pages/dashboard/Projects';
import ProjectDetail from '../pages/dashboard/ProjectDetail';
import Tasks from '../pages/dashboard/Tasks';
import NotFound from '../pages/NotFound';

// Layout
import DashboardLayout from '../components/layout/DashboardLayout';

// Route protection
import ProtectedRoute from './ProtectedRoute';

/**
 * Application Routes Configuration
 * Defines all routes with authentication and role-based protection
 */
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected Dashboard Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* Redirect root to dashboard */}
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="projects" element={<Projects />} />
        <Route path="projects/:id" element={<ProjectDetail />} />
        <Route path="tasks" element={<Tasks />} />
      </Route>

      {/* 404 Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
