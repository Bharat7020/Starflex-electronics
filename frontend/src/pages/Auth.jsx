import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Auth.css';

const Auth = () => {
  const [tab, setTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { login, signup } = useAuth();
  const { loadCart } = useCart();
  const navigate = useNavigate();

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });

  const validateLogin = () => {
    const errs = {};
    if (!loginForm.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errs.email = 'Valid email required';
    if (!loginForm.password) errs.password = 'Password is required';
    return errs;
  };

  const validateSignup = () => {
    const errs = {};
    if (!signupForm.name.trim() || signupForm.name.length < 2) errs.name = 'Name must be at least 2 characters';
    if (!signupForm.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errs.email = 'Valid email required';
    if (signupForm.password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (signupForm.password !== signupForm.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    return errs;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const errs = validateLogin();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      await login(loginForm.email, loginForm.password);
      await loadCart();
      navigate('/');
    } catch (err) {
      setErrors({ general: err.response?.data?.message || 'Login failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const errs = validateSignup();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      await signup(signupForm.name, signupForm.email, signupForm.password);
      await loadCart();
      navigate('/');
    } catch (err) {
      setErrors({ general: err.response?.data?.message || 'Signup failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupForm(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  return (
    <main className="page-wrapper auth-page">
      {/* Background */}
      <div className="auth-bg">
        <div className="auth-orb auth-orb-1" />
        <div className="auth-orb auth-orb-2" />
      </div>

      <div className="auth-card glass-card">
        {/* Logo */}
        <Link to="/" className="auth-logo">
          <svg width="36" height="36" viewBox="0 0 32 32" fill="none" aria-hidden="true">
            <rect width="32" height="32" rx="8" fill="url(#authGrad)"/>
            <path d="M8 16L14 10L20 16L14 22L8 16Z" fill="#06b6d4" opacity="0.9"/>
            <path d="M16 8L24 16L16 24" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <defs>
              <linearGradient id="authGrad" x1="0" y1="0" x2="32" y2="32">
                <stop stopColor="#3b82f6"/>
                <stop offset="1" stopColor="#06b6d4"/>
              </linearGradient>
            </defs>
          </svg>
          <span className="auth-logo-text">Star<span className="text-gradient">Flex</span></span>
        </Link>

        {/* Tabs */}
        <div className="auth-tabs" role="tablist">
          <button
            role="tab"
            aria-selected={tab === 'login'}
            className={`auth-tab ${tab === 'login' ? 'active' : ''}`}
            onClick={() => { setTab('login'); setErrors({}); }}
          >
            Sign In
          </button>
          <button
            role="tab"
            aria-selected={tab === 'signup'}
            className={`auth-tab ${tab === 'signup' ? 'active' : ''}`}
            onClick={() => { setTab('signup'); setErrors({}); }}
          >
            Create Account
          </button>
        </div>

        {errors.general && (
          <div className="auth-error-banner" role="alert">
            <i className="fa-solid fa-triangle-exclamation"></i> {errors.general}
          </div>
        )}

        {/* Login Form */}
        {tab === 'login' && (
          <form onSubmit={handleLogin} noValidate aria-label="Login form" className="auth-form">
            <div className="form-group">
              <label htmlFor="login-email" className="form-label">Email Address</label>
              <input
                id="login-email" name="email" type="email" value={loginForm.email}
                onChange={handleLoginChange} placeholder="you@example.com"
                className={`form-control ${errors.email ? 'error' : ''}`}
                autoComplete="email" aria-invalid={!!errors.email}
              />
              {errors.email && <span className="form-error">⚠ {errors.email}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="login-password" className="form-label">Password</label>
              <input
                id="login-password" name="password" type="password" value={loginForm.password}
                onChange={handleLoginChange} placeholder="Your password"
                className={`form-control ${errors.password ? 'error' : ''}`}
                autoComplete="current-password" aria-invalid={!!errors.password}
              />
              {errors.password && <span className="form-error">⚠ {errors.password}</span>}
            </div>
            <button
              id="login-submit-btn"
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: '100%' }}
              disabled={loading}
            >
              {loading ? '⏳ Signing in...' : '→ Sign In'}
            </button>
            <p className="auth-switch">
              Don't have an account?{' '}
              <button
                type="button"
                className="auth-switch-btn"
                onClick={() => { setTab('signup'); setErrors({}); }}
              >
                Create one now
              </button>
            </p>
          </form>
        )}

        {/* Signup Form */}
        {tab === 'signup' && (
          <form onSubmit={handleSignup} noValidate aria-label="Sign up form" className="auth-form">
            <div className="form-group">
              <label htmlFor="signup-name" className="form-label">Full Name</label>
              <input
                id="signup-name" name="name" type="text" value={signupForm.name}
                onChange={handleSignupChange} placeholder="John Doe"
                className={`form-control ${errors.name ? 'error' : ''}`}
                autoComplete="name" aria-invalid={!!errors.name}
              />
              {errors.name && <span className="form-error">⚠ {errors.name}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="signup-email" className="form-label">Email Address</label>
              <input
                id="signup-email" name="email" type="email" value={signupForm.email}
                onChange={handleSignupChange} placeholder="you@example.com"
                className={`form-control ${errors.email ? 'error' : ''}`}
                autoComplete="email" aria-invalid={!!errors.email}
              />
              {errors.email && <span className="form-error">⚠ {errors.email}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="signup-password" className="form-label">Password</label>
              <input
                id="signup-password" name="password" type="password" value={signupForm.password}
                onChange={handleSignupChange} placeholder="Min. 6 characters"
                className={`form-control ${errors.password ? 'error' : ''}`}
                autoComplete="new-password" aria-invalid={!!errors.password}
              />
              {errors.password && <span className="form-error">⚠ {errors.password}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="signup-confirm" className="form-label">Confirm Password</label>
              <input
                id="signup-confirm" name="confirmPassword" type="password" value={signupForm.confirmPassword}
                onChange={handleSignupChange} placeholder="Repeat your password"
                className={`form-control ${errors.confirmPassword ? 'error' : ''}`}
                autoComplete="new-password" aria-invalid={!!errors.confirmPassword}
              />
              {errors.confirmPassword && <span className="form-error">⚠ {errors.confirmPassword}</span>}
            </div>
            <button
              id="signup-submit-btn"
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: '100%' }}
              disabled={loading}
            >
              {loading ? '⏳ Creating account...' : '🚀 Create Account'}
            </button>
            <p className="auth-switch">
              Already have an account?{' '}
              <button
                type="button"
                className="auth-switch-btn"
                onClick={() => { setTab('login'); setErrors({}); }}
              >
                Sign in
              </button>
            </p>
          </form>
        )}

        <p className="auth-terms">
          By continuing, you agree to StarFlex's{' '}
          <Link to="/contact" style={{ color: 'var(--blue-light)' }}>Terms of Service</Link>
          {' '}and{' '}
          <Link to="/contact" style={{ color: 'var(--blue-light)' }}>Privacy Policy</Link>.
        </p>
      </div>
    </main>
  );
};

export default Auth;
