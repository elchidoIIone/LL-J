import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Explore from './pages/Explore';
import RestaurantDetail from './pages/RestaurantDetail';
import Profile from './pages/Profile';
import Saved from './pages/Saved';
import Login from './pages/Login';
import Register from './pages/Register';
import Sponsorship from './pages/Sponsorship';
import OwnerDashboard from './pages/owner/Dashboard';
import type { ReactNode } from 'react';

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/saved', element: <Saved /> },
      { path: '/profile', element: <ProtectedRoute><Profile /></ProtectedRoute> },
    ],
  },
  { path: '/explore', element: <Explore /> },
  { path: '/restaurant/:id', element: <RestaurantDetail /> },
  { path: '/sponsorship/:restaurantId', element: <ProtectedRoute><Sponsorship /></ProtectedRoute> },
  { path: '/owner/dashboard', element: <ProtectedRoute><OwnerDashboard /></ProtectedRoute> },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  { path: '*', element: <Navigate to="/" replace /> },
]);

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
