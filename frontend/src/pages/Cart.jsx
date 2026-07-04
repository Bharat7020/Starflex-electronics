import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Cart.css';

const Cart = () => {
  const { cartItems, cartTotal, itemCount, updateItem, removeItem, emptyCart } = useCart();
  const navigate = useNavigate();

  const shipping = cartTotal >= 99 ? 0 : 9.99;
  const tax = parseFloat((cartTotal * 0.08).toFixed(2));
  const grandTotal = parseFloat((cartTotal + shipping + tax).toFixed(2));

  if (cartItems.length === 0) {
    return (
      <main className="page-wrapper page-enter">
        <div className="container" style={{ paddingTop: '48px' }}>
          <div className="empty-state">
            <div className="icon">🛒</div>
            <h1 className="h2">Your cart is empty</h1>
            <p>Looks like you haven't added anything yet. Explore our amazing products!</p>
            <Link to="/products" className="btn btn-primary btn-lg">Start Shopping</Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="page-wrapper page-enter">
      <div className="container cart-page">
        <div className="cart-header">
          <h1 className="h1">Shopping Cart</h1>
          <span className="text-muted">{itemCount} item{itemCount !== 1 ? 's' : ''}</span>
          <button className="btn btn-danger btn-sm" onClick={emptyCart} style={{ marginLeft: 'auto' }}>
            🗑 Clear Cart
          </button>
        </div>

        <div className="cart-layout">
          {/* Items */}
          <div className="cart-items">
            {cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <Link to={`/products/${item.productId}`} className="cart-item-img-wrap">
                  <img src={item.image} alt={item.title} className="cart-item-img" loading="lazy" />
                </Link>
                <div className="cart-item-info">
                  <div className="cart-item-top">
                    <div>
                      <span className="cart-item-cat">{item.category}</span>
                      <Link to={`/products/${item.productId}`} className="cart-item-title">
                        {item.title}
                      </Link>
                    </div>
                    <button
                      className="btn btn-danger btn-sm btn-icon"
                      onClick={() => removeItem(item.id, item.title)}
                      aria-label={`Remove ${item.title}`}
                    >
                      🗑
                    </button>
                  </div>

                  <div className="cart-item-bottom">
                    <div className="qty-control">
                      <button
                        className="qty-btn"
                        onClick={() => updateItem(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        aria-label="Decrease quantity"
                      >−</button>
                      <span className="qty-value" aria-live="polite">{item.quantity}</span>
                      <button
                        className="qty-btn"
                        onClick={() => updateItem(item.id, item.quantity + 1)}
                        aria-label="Increase quantity"
                      >+</button>
                    </div>
                    <div className="cart-item-pricing">
                      <span className="cart-item-unit">${item.price.toFixed(2)} each</span>
                      <span className="cart-item-total">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <aside className="cart-summary" aria-label="Order summary">
            <h2 className="h3">Order Summary</h2>

            <div className="cart-summary-rows">
              <div className="cart-summary-row">
                <span>Subtotal ({itemCount} items)</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="cart-summary-row">
                <span>Shipping</span>
                <span className={shipping === 0 ? 'free-shipping' : ''}>
                  {shipping === 0 ? '🎉 Free' : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              {cartTotal < 99 && (
                <p className="free-ship-msg">
                  Add <strong>${(99 - cartTotal).toFixed(2)}</strong> more for free shipping!
                </p>
              )}
              <div className="cart-summary-row">
                <span>Estimated Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
            </div>

            <div className="cart-summary-total">
              <span>Order Total</span>
              <span className="cart-total-val">${grandTotal.toFixed(2)}</span>
            </div>

            <button
              id="checkout-btn"
              className="btn btn-primary btn-lg"
              style={{ width: '100%' }}
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout →
            </button>

            <Link to="/products" className="btn btn-secondary" style={{ width: '100%', textAlign: 'center' }}>
              ← Continue Shopping
            </Link>

            <div className="cart-trust">
              <span>🔒 Secure Checkout</span>
              <span>↩️ Free Returns</span>
              <span>🛡️ 2-Year Warranty</span>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default Cart;
