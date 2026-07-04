import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Checkout.css';

const STEPS = ['Shipping', 'Payment', 'Review'];

const validate = (data, step) => {
  const errors = {};
  if (step === 0) {
    if (!data.firstName?.trim()) errors.firstName = 'First name is required';
    if (!data.lastName?.trim()) errors.lastName = 'Last name is required';
    if (!data.email?.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errors.email = 'Valid email required';
    // India phone: +91 followed by 10 digits
    if (!data.phone?.replace(/\s/g, '').match(/^\+91\d{10}$/)) {
      errors.phone = 'Valid 10-digit Indian number (+91 xxxxxxxxxx) required';
    }
    if (!data.address?.trim()) errors.address = 'Address is required';
    if (!data.city?.trim()) errors.city = 'City is required';
    // India PIN Code: 6 digits
    if (!data.zipCode?.match(/^\d{6}$/)) errors.zipCode = 'Valid 6-digit PIN code required';
    if (!data.country?.trim()) errors.country = 'Country is required';
  }
  if (step === 1) {
    if (!data.cardName?.trim()) errors.cardName = 'Cardholder name required';
    if (!data.cardNumber?.replace(/\s/g, '').match(/^\d{16}$/)) errors.cardNumber = 'Valid 16-digit card number required';
    if (!data.expiry?.match(/^\d{2}\/\d{2}$/)) errors.expiry = 'Use MM/YY format';
    if (!data.cvv?.match(/^\d{3,4}$/)) errors.cvv = 'CVV must be 3-4 digits';
  }
  return errors;
};

const FormField = ({ name, label, type = 'text', placeholder, autoComplete, value, onChange, error }) => (
  <div className="form-group">
    <label htmlFor={name} className="form-label">{label}</label>
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      autoComplete={autoComplete}
      className={`form-control ${error ? 'error' : ''}`}
      aria-invalid={!!error}
      aria-describedby={error ? `${name}-error` : undefined}
    />
    {error && <span id={`${name}-error`} className="form-error">⚠ {error}</span>}
  </div>
);

const Checkout = () => {
  const { cartItems, cartTotal, itemCount, emptyCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: '+91 ',
    address: '',
    city: 'Pune',
    state: 'Maharashtra',
    zipCode: '411001',
    country: 'India',
    saveAddress: false,
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
    paymentMethod: 'card',
  });

  if (cartItems.length === 0) {
    return (
      <main className="page-wrapper page-enter">
        <div className="container" style={{ paddingTop: '64px' }}>
          <div className="empty-state">
            <div className="icon">🛒</div>
            <h1 className="h2">Nothing to checkout</h1>
            <p>Your cart is empty. Add some products first!</p>
            <Link to="/products" className="btn btn-primary btn-lg">Shop Now</Link>
          </div>
        </div>
      </main>
    );
  }

  const shipping = cartTotal >= 4999 ? 0 : 499;
  const tax = parseFloat((cartTotal * 0.18).toFixed(2));
  const grandTotal = parseFloat((cartTotal + shipping + tax).toFixed(2));

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let val = type === 'checkbox' ? checked : value;

    // Maintain +91 prefix for phone
    if (name === 'phone') {
      if (!val.startsWith('+91 ')) val = '+91 ' + val.replace(/^\+91\s?/, '');
      val = val.slice(0, 14); // +91 + space + 10 digits
    }

    // PIN code constraints (6 digits)
    if (name === 'zipCode') {
      val = val.replace(/\D/g, '').slice(0, 6);
    }

    // Format card number
    if (name === 'cardNumber') {
      val = value.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})/g, '$1 ').trim();
    }
    // Format expiry
    if (name === 'expiry') {
      val = value.replace(/\D/g, '').slice(0, 4);
      if (val.length >= 2) val = val.slice(0, 2) + '/' + val.slice(2);
    }
    // CVV
    if (name === 'cvv') val = value.replace(/\D/g, '').slice(0, 4);

    setForm(prev => ({ ...prev, [name]: val }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleNext = () => {
    const errs = validate(form, step);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setStep(s => s + 1);
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    setStep(s => s - 1);
    window.scrollTo(0, 0);
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    // Simulate order processing
    await new Promise(r => setTimeout(r, 1500));
    await emptyCart();
    setLoading(false);
    navigate('/order-success', {
      state: {
        orderNumber: 'SF' + Math.random().toString(36).slice(2, 8).toUpperCase(),
        total: grandTotal,
        email: form.email,
      }
    });
  };

  // Removed inline component to prevent focus bug

  return (
    <main className="page-wrapper page-enter">
      <div className="container checkout-page">
        <h1 className="h1" style={{ marginBottom: '32px' }}>Checkout</h1>

        {/* Step Progress */}
        <div className="checkout-steps" aria-label="Checkout progress">
          {STEPS.map((s, i) => (
            <div key={s} className={`checkout-step ${i < step ? 'done' : i === step ? 'active' : ''}`}>
              <div className="checkout-step-circle">
                {i < step ? '✓' : i + 1}
              </div>
              <span className="checkout-step-label">{s}</span>
              {i < STEPS.length - 1 && <div className="checkout-step-line" />}
            </div>
          ))}
        </div>

        <div className="checkout-layout">
          {/* Form */}
          <div className="checkout-form-wrap">
            {/* Step 0: Shipping */}
            {step === 0 && (
              <div className="checkout-section" aria-label="Shipping information">
                <h2 className="checkout-section-title">📦 Shipping Information</h2>
                <div className="form-grid-2">
                  <FormField name="firstName" label="First Name" placeholder="John" autoComplete="given-name" value={form.firstName} onChange={handleChange} error={errors.firstName} />
                  <FormField name="lastName" label="Last Name" placeholder="Doe" autoComplete="family-name" value={form.lastName} onChange={handleChange} error={errors.lastName} />
                </div>
                <div className="form-grid-2">
                  <FormField name="email" label="Email Address" type="email" placeholder="john@example.com" autoComplete="email" value={form.email} onChange={handleChange} error={errors.email} />
                  <FormField name="phone" label="Phone Number" type="tel" placeholder="+91 9876543210" autoComplete="tel" value={form.phone} onChange={handleChange} error={errors.phone} />
                </div>
                <FormField name="address" label="Street Address" placeholder="123 Main St, Apt 4B" autoComplete="street-address" value={form.address} onChange={handleChange} error={errors.address} />
                <div className="form-grid-3">
                  <FormField name="city" label="City" placeholder="Pune" autoComplete="address-level2" value={form.city} onChange={handleChange} error={errors.city} />
                  <FormField name="state" label="State" placeholder="Maharashtra" autoComplete="address-level1" value={form.state} onChange={handleChange} error={errors.state} />
                  <FormField name="zipCode" label="PIN Code" placeholder="411001" autoComplete="postal-code" value={form.zipCode} onChange={handleChange} error={errors.zipCode} />
                </div>
                <FormField name="country" label="Country" placeholder="India" autoComplete="country-name" value={form.country} onChange={handleChange} error={errors.country} />
                <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
                  <input
                    type="checkbox"
                    id="saveAddress"
                    name="saveAddress"
                    checked={form.saveAddress}
                    onChange={handleChange}
                    style={{ width: '16px', height: '16px', accentColor: 'var(--blue)' }}
                  />
                  <label htmlFor="saveAddress" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                    Save this address for future orders
                  </label>
                </div>
              </div>
            )}

            {/* Step 1: Payment */}
            {step === 1 && (
              <div className="checkout-section" aria-label="Payment information">
                <h2 className="checkout-section-title">💳 Payment Method</h2>
                <div className="payment-methods">
                  {['card', 'paypal', 'apple'].map(m => (
                    <label key={m} className={`payment-method ${form.paymentMethod === m ? 'active' : ''}`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={m}
                        checked={form.paymentMethod === m}
                        onChange={handleChange}
                      />
                      <span>{m === 'card' ? '💳 Credit/Debit Card' : m === 'paypal' ? '🅿️ PayPal' : '🍎 Apple Pay'}</span>
                    </label>
                  ))}
                </div>

                {form.paymentMethod === 'card' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '8px' }}>
                    <FormField name="cardName" label="Cardholder Name" placeholder="John Doe" autoComplete="cc-name" value={form.cardName} onChange={handleChange} error={errors.cardName} />
                    <div className="form-group">
                      <label htmlFor="cardNumber" className="form-label">Card Number</label>
                      <input
                        id="cardNumber"
                        name="cardNumber"
                        type="text"
                        value={form.cardNumber}
                        onChange={handleChange}
                        placeholder="1234 5678 9012 3456"
                        autoComplete="cc-number"
                        maxLength={19}
                        className={`form-control ${errors.cardNumber ? 'error' : ''}`}
                        aria-invalid={!!errors.cardNumber}
                      />
                      {errors.cardNumber && <span className="form-error">⚠ {errors.cardNumber}</span>}
                    </div>
                    <div className="form-grid-2">
                      <FormField name="expiry" label="Expiry (MM/YY)" placeholder="12/27" autoComplete="cc-exp" value={form.expiry} onChange={handleChange} error={errors.expiry} />
                      <FormField name="cvv" label="CVV" placeholder="123" autoComplete="cc-csc" value={form.cvv} onChange={handleChange} error={errors.cvv} />
                    </div>
                    <div className="card-icons">
                      {['💳 Visa', '💳 MC', '💳 Amex', '💳 Discover'].map(c => (
                        <span key={c} className="card-icon-badge">{c}</span>
                      ))}
                    </div>
                  </div>
                )}
                {form.paymentMethod !== 'card' && (
                  <div className="alt-payment-msg">
                    <span>You'll be redirected to {form.paymentMethod === 'paypal' ? 'PayPal' : 'Apple Pay'} to complete your payment.</span>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Review */}
            {step === 2 && (
              <div className="checkout-section" aria-label="Order review">
                <h2 className="checkout-section-title">📋 Review Your Order</h2>
                <div className="review-section">
                  <h3>Shipping to:</h3>
                  <p>{form.firstName} {form.lastName}</p>
                  <p>{form.address}, {form.city}, {form.state} {form.zipCode}</p>
                  <p>{form.country}</p>
                  <p>{form.email} • {form.phone}</p>
                </div>
                <div className="review-section">
                  <h3>Payment:</h3>
                  <p>{form.paymentMethod === 'card'
                    ? `Card ending in ${form.cardNumber.slice(-4)}`
                    : form.paymentMethod === 'paypal' ? 'PayPal' : 'Apple Pay'}
                  </p>
                </div>
                <div className="review-items">
                  {cartItems.map(item => (
                    <div key={item.id} className="review-item">
                      <img src={item.image} alt={item.title} className="review-item-img" loading="lazy" />
                      <div className="review-item-info">
                        <p className="review-item-title">{item.title}</p>
                        <p className="review-item-qty">Qty: {item.quantity}</p>
                      </div>
                      <span className="review-item-price">₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="checkout-nav">
              {step > 0 && (
                <button className="btn btn-secondary btn-lg" onClick={handleBack}>
                  ← Back
                </button>
              )}
              {step < 2 ? (
                <button className="btn btn-primary btn-lg" onClick={handleNext} style={{ marginLeft: 'auto' }}>
                  Continue →
                </button>
              ) : (
                <button
                  id="place-order-btn"
                  className="btn btn-primary btn-lg"
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  style={{ marginLeft: 'auto', minWidth: '200px' }}
                >
                  {loading ? '⏳ Processing...' : '✓ Place Order'}
                </button>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <aside className="checkout-summary" aria-label="Order summary">
            <h2 className="h3" style={{ marginBottom: '16px' }}>Order Summary</h2>
            <div className="checkout-items">
              {cartItems.map(item => (
                <div key={item.id} className="checkout-item">
                  <div className="checkout-item-img-wrap">
                    <img src={item.image} alt={item.title} loading="lazy" />
                    <span className="checkout-item-qty">{item.quantity}</span>
                  </div>
                  <div className="checkout-item-name">{item.title}</div>
                  <div className="checkout-item-price">₹{(item.price * item.quantity).toFixed(2)}</div>
                </div>
              ))}
            </div>
            <div className="checkout-total-rows">
              <div className="cart-summary-row">
                <span>Subtotal</span>
                <span>₹{cartTotal.toFixed(2)}</span>
              </div>
              <div className="cart-summary-row">
                <span>Shipping</span>
                <span className={shipping === 0 ? 'free-shipping' : ''}>{shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}</span>
              </div>
              <div className="cart-summary-row">
                <span>Tax (GST 18%)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
            </div>
            <div className="checkout-grand-total">
              <span>Total</span>
              <span className="cart-total-val">₹{grandTotal.toFixed(2)}</span>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default Checkout;
