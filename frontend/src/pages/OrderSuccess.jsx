import { useLocation, Link } from 'react-router-dom';
import './OrderSuccess.css';

const OrderSuccess = () => {
  const { state } = useLocation();
  const orderNumber = state?.orderNumber || 'SF' + Math.random().toString(36).slice(2, 8).toUpperCase();
  const total = state?.total?.toFixed(2) || '0.00';
  const email = state?.email || 'your email';

  return (
    <main className="page-wrapper page-enter">
      <div className="container success-page">
        <div className="success-card glass-card">
          <div className="success-icon-wrap">
            <div className="success-icon">✓</div>
          </div>
          <h1 className="success-title">Order Confirmed!</h1>
          <p className="success-sub">
            Thank you for your purchase! Your order has been successfully placed.
          </p>
          <div className="success-details">
            <div className="success-detail-row">
              <span>Order Number</span>
              <span className="success-order-num">#{orderNumber}</span>
            </div>
            <div className="success-detail-row">
              <span>Order Total</span>
              <strong>₹{total}</strong>
            </div>
            <div className="success-detail-row">
              <span>Confirmation sent to</span>
              <strong>{email}</strong>
            </div>
            <div className="success-detail-row">
              <span>Estimated Delivery</span>
              <strong>3–5 Business Days</strong>
            </div>
          </div>
          <div className="success-steps">
            {[
              { icon: '✓', label: 'Order Placed' },
              { icon: '📦', label: 'Processing' },
              { icon: '🚚', label: 'Shipped' },
              { icon: '🏠', label: 'Delivered' },
            ].map((s, i) => (
              <div key={s.label} className={`success-step ${i === 0 ? 'done' : i === 1 ? 'active' : ''}`}>
                <div className="success-step-icon">{s.icon}</div>
                <span>{s.label}</span>
                {i < 3 && <div className="success-step-line" />}
              </div>
            ))}
          </div>
          <div className="success-actions">
            <Link to="/products" className="btn btn-primary btn-lg">Continue Shopping</Link>
            <Link to="/" className="btn btn-secondary btn-lg">Back to Home</Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default OrderSuccess;
