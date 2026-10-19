import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';

// CUSTOM HOOK: gives any component the current user, role helpers and login / logout
export default function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
