import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchProducts } from '../services/api';
import ProductCard from '../components/ProductCard';
import { SkeletonGrid } from '../components/LoadingSpinner';
import './Home.css';

const CATEGORIES = [
  { name: 'Laptops', icon: <i className="fa-solid fa-laptop"></i>, color: '#3b82f6' },
  { name: 'Smartphones', icon: <i className="fa-solid fa-mobile-screen-button"></i>, color: '#06b6d4' },
  { name: 'Audio', icon: <i className="fa-solid fa-headphones"></i>, color: '#8b5cf6' },
  { name: 'Monitors', icon: <i className="fa-solid fa-desktop"></i>, color: '#10b981' },
  { name: 'Tablets', icon: <i className="fa-solid fa-tablet-screen-button"></i>, color: '#f59e0b' },
  { name: 'Cameras', icon: <i className="fa-solid fa-camera"></i>, color: '#ec4899' },
  { name: 'Gaming', icon: <i className="fa-solid fa-gamepad"></i>, color: '#ef4444' },
  { name: 'Wearables', icon: <i className="fa-solid fa-stopwatch-20"></i>, color: '#6366f1' },
];

const FEATURES = [
  { icon: <i className="fa-solid fa-truck-fast"></i>, title: 'Free Express Shipping', desc: 'On all orders over ₹4,999. Speed matters.' },
  { icon: <i className="fa-solid fa-shield-halved"></i>, title: 'Secure Payments', desc: 'Bank-level encryption on every transaction.' },
  { icon: <i className="fa-solid fa-arrow-rotate-left"></i>, title: '30-Day Returns', desc: 'No hassle, no questions asked returns.' },
  { icon: <i className="fa-solid fa-headset"></i>, title: '24/7 Expert Support', desc: 'Tech experts are always here to help.' },
];

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchProducts({ sort: 'rating' });
        setFeatured(res.data.data.slice(0, 8));
      } catch {
        setFeatured([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <main className="page-wrapper page-enter">
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="hero" aria-label="Hero section">
        <div className="hero-bg">
          <div className="hero-orb hero-orb-1" />
          <div className="hero-orb hero-orb-2" />
          <div className="hero-orb hero-orb-3" />
          <div className="hero-grid" />
        </div>
        <div className="container hero-content">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            New Arrivals — Spring 2026 Collection
          </div>
          <h1 className="display-1">
            The Future of <br />
            <span className="text-gradient">Tech Starts Here</span>
          </h1>
          <p className="hero-sub">
            Discover premium electronics curated for visionaries. From cutting-edge laptops
            to studio-grade audio — experience technology redefined.
          </p>
          <form className="hero-search" onSubmit={handleSearch} role="search">
            <div className="hero-search-input-wrap">
              <span className="hero-search-icon">
                <i className="fa-solid fa-magnifying-glass"></i>
              </span>
              <input
                type="search"
                id="hero-search"
                placeholder="Search for laptops, phones, headphones..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="hero-search-input"
                aria-label="Search products"
              />
            </div>
            <button type="submit" className="btn btn-primary btn-lg hero-search-btn">
              Search
            </button>
          </form>
          <div className="hero-stats">
            {[['20+', 'Premium Products'], ['50K+', 'Happy Customers'], ['4.9', 'Avg Rating']].map(([val, lbl]) => (
              <div key={lbl} className="hero-stat">
                <span className="hero-stat-val">
                  {val}{lbl === 'Avg Rating' && <i className="fa-solid fa-star" style={{ fontSize: '0.8em', marginLeft: '4px', color: 'var(--yellow)' }}></i>}
                </span>
                <span className="hero-stat-lbl">{lbl}</span>
              </div>
            ))}
          </div>
          <div className="hero-ctas">
            <Link to="/products" className="btn btn-primary btn-lg">Shop Now <i className="fa-solid fa-arrow-right"></i></Link>
            <Link to="/products?sort=rating" className="btn btn-secondary btn-lg">View Top Rated</Link>
          </div>
        </div>
        <div className="hero-scroll-hint" aria-hidden="true">
          <span>Scroll to explore</span>
          <div className="hero-scroll-arrow" />
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────── */}
      <section className="section-sm" aria-label="Key features">
        <div className="container">
          <div className="features-grid">
            {FEATURES.map(({ icon, title, desc }) => (
              <div key={title} className="feature-card glass-card">
                <span className="feature-icon">{icon}</span>
                <div>
                  <h3 className="feature-title">{title}</h3>
                  <p className="feature-desc">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ───────────────────────────────────────────── */}
      <section className="section" aria-label="Browse categories">
        <div className="container">
          <div className="section-header">
            <p className="overline">Explore</p>
            <h2>Shop by <span className="text-gradient">Category</span></h2>
            <p className="text-muted">Browse our curated selection of premium tech</p>
          </div>
          <div className="categories-grid">
            {CATEGORIES.map(({ name, icon, color }) => (
              <Link
                key={name}
                to={`/products?category=${name}`}
                className="category-card"
                style={{ '--cat-color': color }}
                aria-label={`Browse ${name}`}
              >
                <span className="category-icon">{icon}</span>
                <span className="category-name">{name}</span>
                <span className="category-arrow">
                  <i className="fa-solid fa-arrow-right"></i>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ─────────────────────────────────────── */}
      <section className="section" aria-label="Featured products">
        <div className="container">
          <div className="section-header">
            <p className="overline">Handpicked</p>
            <h2>Featured <span className="text-gradient">Products</span></h2>
            <p className="text-muted">Our top-rated products, loved by thousands of customers</p>
          </div>
          {loading ? (
            <SkeletonGrid count={8} />
          ) : featured.length > 0 ? (
            <>
              <div className="product-grid">
                {featured.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
              <div style={{ textAlign: 'center', marginTop: '48px' }}>
                <Link to="/products" className="btn btn-outline btn-lg">
                  View All Products <i className="fa-solid fa-arrow-right"></i>
                </Link>
              </div>
            </>
          ) : (
            <div className="empty-state">
              <div className="icon">
                <i className="fa-solid fa-bolt"></i>
              </div>
              <h3>Backend not running</h3>
              <p>Start the backend server to see products</p>
              <Link to="/products" className="btn btn-primary">Go to Products</Link>
            </div>
          )}
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────────── */}
      <section className="cta-section section-sm" aria-label="Call to action">
        <div className="container">
          <div className="cta-card glass-card">
            <div className="cta-orb" />
            <div className="cta-content">
              <h2 className="h1">Ready to upgrade your <span className="text-gradient">tech game?</span></h2>
              <p className="text-muted">
                Join over 50,000 customers who trust StarFlex for their premium electronics.
              </p>
            </div>
            <div className="cta-actions">
              <Link to="/products" className="btn btn-primary btn-lg">Shop Now</Link>
              <Link to="/contact" className="btn btn-secondary btn-lg">Contact Us</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
