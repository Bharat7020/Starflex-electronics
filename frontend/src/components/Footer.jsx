import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const links = {
    Shop: [
      { label: 'Laptops', to: '/products?category=Laptops' },
      { label: 'Smartphones', to: '/products?category=Smartphones' },
      { label: 'Audio', to: '/products?category=Audio' },
      { label: 'Tablets', to: '/products?category=Tablets' },
      { label: 'Accessories', to: '/products?category=Accessories' },
    ],
    Company: [
      { label: 'About Us', to: '/contact' },
      { label: 'Contact', to: '/contact' },
      { label: 'Careers', to: '/contact' },
      { label: 'Blog', to: '/contact' },
    ],
    Support: [
      { label: 'Help Center', to: '/contact' },
      { label: 'Shipping Info', to: '/contact' },
      { label: 'Returns', to: '/contact' },
      { label: 'Privacy Policy', to: '/contact' },
    ],
  };

  const socials = [
    { label: 'Twitter/X', icon: <i className="fa-brands fa-x-twitter"></i>, href: 'https://twitter.com' },
    { label: 'Instagram', icon: <i className="fa-brands fa-instagram"></i>, href: 'https://instagram.com' },
    { label: 'YouTube', icon: <i className="fa-brands fa-youtube"></i>, href: 'https://youtube.com' },
    { label: 'GitHub', icon: <i className="fa-brands fa-github"></i>, href: 'https://github.com' },
  ];

  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        {/* Top Row */}
        <div className="footer-top">
          {/* Brand */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                <rect width="32" height="32" rx="8" fill="url(#footerGrad)" />
                <path d="M8 16L14 10L20 16L14 22L8 16Z" fill="#06b6d4" opacity="0.9" />
                <path d="M16 8L24 16L16 24" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <defs>
                  <linearGradient id="footerGrad" x1="0" y1="0" x2="32" y2="32">
                    <stop stopColor="#3b82f6" />
                    <stop offset="1" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="footer-logo-text">Star<span className="footer-logo-accent">Flex</span></span>
            </Link>
            <p className="footer-tagline">
              Premium electronics  curated for those who demand the best in technology.
            </p>
            <div className="footer-socials">
              {socials.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-btn"
                  aria-label={s.label}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([section, items]) => (
            <div key={section} className="footer-col">
              <h3 className="footer-col-title">{section}</h3>
              <ul className="footer-col-links">
                {items.map(item => (
                  <li key={item.label}>
                    <Link to={item.to} className="footer-link">{item.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div className="footer-newsletter">
            <h3 className="footer-col-title">Newsletter</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
              Get the latest deals and new arrivals.
            </p>
            <form
              className="footer-newsletter-form"
              onSubmit={(e) => {
                e.preventDefault();
                e.target.reset();
              }}
            >
              <input
                type="email"
                placeholder="your@email.com"
                className="form-control"
                style={{ borderRadius: 'var(--radius-sm) 0 0 var(--radius-sm)' }}
                aria-label="Email for newsletter"
                required
              />
              <button type="submit" className="btn btn-primary" style={{ borderRadius: '0 var(--radius-sm) var(--radius-sm) 0', padding: '12px 16px', flexShrink: 0 }}>
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            © 2026 StarFlex Electronics. All rights reserved.
          </p>
          <div className="footer-payment">
            {[
              { icon: 'fa-solid fa-credit-card', label: 'Visa' },
              { icon: 'fa-solid fa-credit-card', label: 'MC' },
              { icon: 'fa-brands fa-apple-pay', label: 'Apple Pay' },
              { icon: 'fa-brands fa-paypal', label: 'PayPal' }
            ].map(p => (
              <span key={p.label} className="footer-payment-badge">
                <i className={p.icon}></i> {p.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
