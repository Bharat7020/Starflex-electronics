import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Logo = () => (
  <Link to="/" className="nav-logo" aria-label="StarFlex Electronics Home">
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="url(#logoGrad)"/>
      <path d="M8 16L14 10L20 16L14 22L8 16Z" fill="#06b6d4" opacity="0.9"/>
      <path d="M16 8L24 16L16 24" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <defs>
        <linearGradient id="logoGrad" x1="0" y1="0" x2="32" y2="32">
          <stop stopColor="#3b82f6"/>
          <stop offset="1" stopColor="#06b6d4"/>
        </linearGradient>
      </defs>
    </svg>
    <span className="nav-logo-text">
      Star<span className="nav-logo-accent">Flex</span>
    </span>
  </Link>
);

const Navbar = () => {
  const { itemCount, setDrawerOpen } = useCart();
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const searchRef = useRef(null);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    const handleClick = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSearchOpen(false);
      setMenuOpen(false);
    }
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Products' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <>
      <header className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`} role="banner">
        <div className="nav-inner container">
          <Logo />

          {/* Desktop Nav */}
          <nav className="nav-links" role="navigation" aria-label="Main navigation">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                end={to === '/'}
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="nav-actions">
            {/* Search */}
            <div className={`nav-search-wrap ${searchOpen ? 'open' : ''}`}>
              {searchOpen && (
                <form onSubmit={handleSearch} className="nav-search-form">
                  <input
                    ref={searchRef}
                    type="search"
                    id="nav-search"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="nav-search-input"
                    aria-label="Search products"
                  />
                  <button type="submit" className="nav-icon-btn" aria-label="Submit search">
                    <i className="fa-solid fa-magnifying-glass"></i>
                  </button>
                </form>
              )}
              {!searchOpen && (
                <button
                  className="nav-icon-btn"
                  onClick={() => setSearchOpen(true)}
                  aria-label="Open search"
                >
                  <i className="fa-solid fa-magnifying-glass"></i>
                </button>
              )}
            </div>

            {/* Cart */}
            <button
              id="cart-btn"
              className="nav-icon-btn nav-cart-btn"
              onClick={() => setDrawerOpen(true)}
              aria-label={`Open cart, ${itemCount} items`}
            >
              <i className="fa-solid fa-cart-shopping"></i>
              {itemCount > 0 && (
                <span className="nav-cart-badge" aria-live="polite">{itemCount > 99 ? '99+' : itemCount}</span>
              )}
            </button>

            {/* User */}
            {isAuthenticated ? (
              <div className="nav-user-menu" ref={userMenuRef}>
                <button
                  className="nav-user-btn"
                  onClick={() => setUserMenuOpen(v => !v)}
                  aria-expanded={userMenuOpen}
                  aria-label="User menu"
                >
                  <span className="nav-avatar">{user.name.charAt(0).toUpperCase()}</span>
                  <span className="nav-user-name">{user.name.split(' ')[0]}</span>
                  <span className="nav-chevron">
                    <i className={`fa-solid fa-chevron-${userMenuOpen ? 'up' : 'down'}`}></i>
                  </span>
                </button>
                {userMenuOpen && (
                  <div className="nav-dropdown" role="menu">
                    <div className="nav-dropdown-header">
                      <div className="nav-dropdown-name">{user.name}</div>
                      <div className="nav-dropdown-email">{user.email}</div>
                    </div>
                    <Link to="/cart" className="nav-dropdown-item" onClick={() => setUserMenuOpen(false)} role="menuitem">
                      <i className="fa-solid fa-cart-shopping"></i> My Cart
                    </Link>
                    <button
                      className="nav-dropdown-item nav-dropdown-logout"
                      onClick={() => { logout(); setUserMenuOpen(false); }}
                      role="menuitem"
                    >
                      <i className="fa-solid fa-right-from-bracket"></i> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/auth" className="btn btn-primary btn-sm">Sign In</Link>
            )}

            {/* Hamburger */}
            <button
              className={`nav-hamburger ${menuOpen ? 'open' : ''}`}
              onClick={() => setMenuOpen(v => !v)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              <span /><span /><span />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="nav-mobile-menu" role="navigation" aria-label="Mobile navigation">
            <form onSubmit={handleSearch} className="nav-mobile-search">
              <input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="form-control"
                aria-label="Search products mobile"
              />
              <button type="submit" className="btn btn-primary btn-sm">Search</button>
            </form>
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => `nav-mobile-link ${isActive ? 'active' : ''}`}
                onClick={() => setMenuOpen(false)}
                end={to === '/'}
              >
                {label}
              </NavLink>
            ))}
            {isAuthenticated ? (
              <button className="nav-mobile-link nav-mobile-logout" onClick={() => { logout(); setMenuOpen(false); }}>
                <i className="fa-solid fa-right-from-bracket"></i> Sign Out
              </button>
            ) : (
              <Link to="/auth" className="btn btn-primary" onClick={() => setMenuOpen(false)}>
                Sign In / Sign Up
              </Link>
            )}
          </div>
        )}
      </header>
    </>
  );
};

export default Navbar;
