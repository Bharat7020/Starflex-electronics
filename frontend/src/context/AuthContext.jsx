import { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, signupUser, getMe } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children, showToast }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('sf_token');
    const savedUser = localStorage.getItem('sf_user');
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {}
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await loginUser(email, password);
    const { token, user: userData } = res.data;
    localStorage.setItem('sf_token', token);
    localStorage.setItem('sf_user', JSON.stringify(userData));
    setUser(userData);
    showToast?.(`Welcome back, ${userData.name}! 👋`, 'success');
    return userData;
  };

  const signup = async (name, email, password) => {
    const res = await signupUser(name, email, password);
    const { token, user: userData } = res.data;
    localStorage.setItem('sf_token', token);
    localStorage.setItem('sf_user', JSON.stringify(userData));
    setUser(userData);
    showToast?.(`Account created! Welcome aboard, ${userData.name} 🎉`, 'success');
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('sf_token');
    localStorage.removeItem('sf_user');
    setUser(null);
    showToast?.('Logged out successfully', 'info');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
