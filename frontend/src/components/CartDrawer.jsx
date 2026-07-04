import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './CartDrawer.css';

const CartDrawer = () => {
  const { cartItems, cartTotal, itemCount, drawerOpen, setDrawerOpen, updateItem, removeItem, emptyCart } = useCart();
  const navigate = useNavigate();

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') setDrawerOpen(false); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [setDrawerOpen]);

  if (!drawerOpen) return null;

  const shipping = cartTotal >= 4999 ? 0 : 499;
  const tax = parseFloat((cartTotal * 0.18).toFixed(2));
  const grandTotal = parseFloat((cartTotal + shipping + tax).toFixed(2));

  const handleCheckout = () => {
    setDrawerOpen(false);
    navigate('/checkout');
  };

  return (
    <>
      <div
        className="drawer-overlay"
        onClick={() => setDrawerOpen(false)}
        aria-hidden="true"
      />
      <aside className="drawer" role="dialog" aria-modal="true" aria-label="Shopping cart">
        {/* Header */}
        <div className="drawer-header">
          <div className="drawer-title-row">
            <h2 className="drawer-title">
              <i className="fa-solid fa-cart-shopping"></i> Cart
              {itemCount > 0 && <span className="drawer-count-badge">{itemCount}</span>}
            </h2>
            <button
              className="drawer-close"
              onClick={() => setDrawerOpen(false)}
              aria-label="Close cart"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
          {cartItems.length > 0 && (
            <button
              className="drawer-clear"
              onClick={emptyCart}
            >
              Clear all
            </button>
          )}
        </div>

        {/* Items */}
        <div className="drawer-items">
          {cartItems.length === 0 ? (
            <div className="drawer-empty">
              <div className="drawer-empty-icon">
                <i className="fa-solid fa-cart-shopping"></i>
              </div>
              <h3>Your cart is empty</h3>
              <p>Add some amazing products to get started!</p>
              <button className="btn btn-primary" onClick={() => setDrawerOpen(false)}>
                Start Shopping
              </button>
            </div>
          ) : (
            cartItems.map(item => (
              <div key={item.id} className="drawer-item">
                <Link
                  to={`/products/${item.productId}`}
                  onClick={() => setDrawerOpen(false)}
                  className="drawer-item-img-wrap"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="drawer-item-img"
                    loading="lazy"
                  />
                </Link>
                <div className="drawer-item-info">
                  <Link
                    to={`/products/${item.productId}`}
                    onClick={() => setDrawerOpen(false)}
                    className="drawer-item-title"
                  >
                    {item.title}
                  </Link>
                  <span className="drawer-item-category">{item.category}</span>
                  <div className="drawer-item-footer">
                    <div className="qty-control">
                      <button
                        className="qty-btn"
                        onClick={() => updateItem(item.id, item.quantity - 1)}
                        aria-label={`Decrease quantity of ${item.title}`}
                      >
                        <i className="fa-solid fa-minus"></i>
                      </button>
                      <span className="qty-value" aria-live="polite">{item.quantity}</span>
                      <button
                        className="qty-btn"
                        onClick={() => updateItem(item.id, item.quantity + 1)}
                        aria-label={`Increase quantity of ${item.title}`}
                      >
                        <i className="fa-solid fa-plus"></i>
                      </button>
                    </div>
                    <span className="drawer-item-price">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </span>
                    <button
                      className="drawer-item-remove"
                      onClick={() => removeItem(item.id, item.title)}
                      aria-label={`Remove ${item.title} from cart`}
                    >
                      <i className="fa-solid fa-trash-can"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Totals & Checkout */}
        {cartItems.length > 0 && (
          <div className="drawer-footer">
            <div className="drawer-totals">
              <div className="drawer-total-row">
                <span>Subtotal</span>
                <span>₹{cartTotal.toFixed(2)}</span>
              </div>
              <div className="drawer-total-row">
                <span>Shipping</span>
                <span className={shipping === 0 ? 'free-shipping' : ''}>
                  {shipping === 0 ? (
                    <><i className="fa-solid fa-gift"></i> Free</>
                  ) : `₹${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="drawer-total-row">
                <span>Tax (GST 18%)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              {cartTotal < 4999 && (
                <p className="drawer-free-ship-msg">
                  Add ₹{(4999 - cartTotal).toFixed(2)} more for free shipping!
                </p>
              )}
              <div className="drawer-total-row grand">
                <span>Total</span>
                <span>₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>
            <button className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={handleCheckout}>
              Checkout <i className="fa-solid fa-arrow-right"></i>
            </button>
            <Link
              to="/cart"
              className="btn btn-secondary"
              style={{ width: '100%', textAlign: 'center' }}
              onClick={() => setDrawerOpen(false)}
            >
              View Full Cart
            </Link>
          </div>
        )}
      </aside>
    </>
  );
};

export default CartDrawer;
