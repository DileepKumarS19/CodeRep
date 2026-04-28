import { createContext, useState, useEffect, useContext } from 'react';

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// Decode JWT payload without a library — JWT is just base64 encoded JSON
function decodeToken(token) {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

export const AuthProvider = ({ children }) => {
  const getInitialToken = () => {
    const stored = localStorage.getItem('token');
    return stored && stored !== "null" && stored !== "undefined" ? stored : null;
  };

  const [token, setToken] = useState(getInitialToken());
  const [userId, setUserId] = useState(() => {
    // Extract userId from the stored token on first load
    const stored = getInitialToken();
    if (!stored) return null;
    const decoded = decodeToken(stored);
    return decoded?.id || null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      setIsAuthenticated(true);
      // Decode userId every time token changes
      const decoded = decodeToken(token);
      setUserId(decoded?.id || null);
    } else {
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      setUserId(null);
    }
  }, [token]);

  const login = (newToken) => {
    setToken(newToken);
    // userId will be set automatically by the useEffect above
  };

  const logout = () => {
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, userId, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};