import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import Spinner from './Spinner.jsx';

// Only for logged-OUT visitors (login / register).
// A logged-in user is sent away immediately (replace: true keeps the Back button from returning here).
// This is also what moves a user on after a successful login or sign-up.
export default function GuestRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Spinner />;
  if (user) return <Navigate to={location.state?.from || '/'} replace />;
  return <Outlet />;
}
