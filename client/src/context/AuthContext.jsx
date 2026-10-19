import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { api } from '../utils/api.js';
import useLocalStorage from '../hooks/useLocalStorage.js';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useLocalStorage('pawhome_token', null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(token));

  // On first load, check that the saved token is still valid
  useEffect(() => {
    if (!token) return;
    api('/auth/me')
      .then((d) => setUser(d.user))
      .catch(() => setToken(null))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const authenticate = useCallback(
    async (path, body) => {
      const data = await api(path, { method: 'POST', body });
      setToken(data.token);
      setUser(data.user);
      return data.user;
    },
    [setToken]
  );

  const login = useCallback((creds) => authenticate('/auth/login', creds), [authenticate]);
  const register = useCallback((info) => authenticate('/auth/register', info), [authenticate]);
  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, [setToken]);

  const value = useMemo(
    () => ({
      user,
      loading,
      isLoggedIn: Boolean(user),
      hasRole: (...roles) => Boolean(user) && roles.includes(user.role),
      login,
      register,
      logout,
    }),
    [user, loading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
