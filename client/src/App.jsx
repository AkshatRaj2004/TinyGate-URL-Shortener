import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

import ProtectedRoute    from './components/layout/ProtectedRoute';
import DashboardLayout   from './components/layout/DashboardLayout';

import Home      from './pages/Home';
import Login     from './pages/Login';
import Register  from './pages/Register';
import Dashboard from './pages/Dashboard';
import Links     from './pages/Links';
import Analytics from './pages/Analytics';
import NotFound  from './pages/NotFound';

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/"         element={<Home />} />
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected — all nested under DashboardLayout */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard"                       element={<Dashboard />} />
            <Route path="/dashboard/links"                 element={<Links />} />
            <Route path="/dashboard/analytics/:id"         element={<Analytics />} />
            {/* Redirect /dashboard/* unknowns to dashboard */}
            <Route path="/dashboard/*"                     element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>

    <Toaster
      position="bottom-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: 'rgb(var(--surface))',
          color: 'rgb(var(--fg))',
          border: '1px solid rgb(var(--line))',
          borderRadius: '8px',
          boxShadow: '0 8px 24px -6px rgb(0 0 0 / 0.12)',
          fontSize: '13px',
          padding: '8px 12px',
        },
        success: { iconTheme: { primary: 'rgb(var(--success))', secondary: 'rgb(var(--surface))' } },
        error:   { iconTheme: { primary: 'rgb(var(--danger))',  secondary: 'rgb(var(--surface))' } },
      }}
    />
  </AuthProvider>
);

export default App;
