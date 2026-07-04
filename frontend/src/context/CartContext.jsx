import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchCart, addToCart, updateCartItem, removeCartItem, clearCart } from '../services/api';

const CartContext = createContext(null);

// Generate a guest session ID
const getSessionId = () => {
  let id = localStorage.getItem('sf_session_id');
  if (!id) {
    id = 'sess_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    localStorage.setItem('sf_session_id', id);
  }
  return id;
};

const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'item_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
};

export const CartProvider = ({ children, showToast, onAuthRequired }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [itemCount, setItemCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Init session
  useEffect(() => { getSessionId(); }, []);

  const loadCart = useCallback(async () => {
    try {
      const res = await fetchCart();
      setCartItems(res.data.data || []);
      setCartTotal(res.data.total || 0);
      setItemCount(res.data.itemCount || 0);
    } catch (err) {
      // Fall back silently — backend may not be running
      const local = JSON.parse(localStorage.getItem('sf_cart') || '[]');
      setCartItems(local);
      const total = local.reduce((s, i) => s + i.price * i.quantity, 0);
      const count = local.reduce((s, i) => s + i.quantity, 0);
      setCartTotal(parseFloat(total.toFixed(2)));
      setItemCount(count);
    }
  }, []);

  useEffect(() => { loadCart(); }, [loadCart]);

  const addItem = async (product, qty = 1) => {
    // ── Auth guard: user must be logged in ──────────────────────
    const token = localStorage.getItem('sf_token');
    if (!token) {
      showToast?.('Please log in to add items to your cart 🔒', 'error');
      onAuthRequired?.();
      return;
    }

    setLoading(true);
    try {
      const res = await addToCart(product.id, qty);
      setCartItems(res.data.data);
      setCartTotal(res.data.total);
      setItemCount(res.data.itemCount);
      showToast?.(`${product.title} added to cart! 🛒`, 'success');
    } catch {
      // Offline fallback (backend unreachable) — still requires login
      const local = JSON.parse(localStorage.getItem('sf_cart') || '[]');
      const existing = local.find(i => i.productId === product.id);
      if (existing) {
        existing.quantity += qty;
      } else {
        local.push({
          id: generateId(),
          productId: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          quantity: qty,
          category: product.category,
        });
      }
      localStorage.setItem('sf_cart', JSON.stringify(local));
      setCartItems(local);
      const total = local.reduce((s, i) => s + i.price * i.quantity, 0);
      setCartTotal(parseFloat(total.toFixed(2)));
      setItemCount(local.reduce((s, i) => s + i.quantity, 0));
      showToast?.(`${product.title} added to cart! 🛒`, 'success');
    } finally {
      setLoading(false);
    }
  };

  const updateItem = async (itemId, quantity) => {
    try {
      const res = await updateCartItem(itemId, quantity);
      setCartItems(res.data.data);
      setCartTotal(res.data.total);
      setItemCount(res.data.itemCount);
    } catch {
      const local = JSON.parse(localStorage.getItem('sf_cart') || '[]');
      const updated = quantity === 0
        ? local.filter(i => i.id !== itemId)
        : local.map(i => i.id === itemId ? { ...i, quantity } : i);
      localStorage.setItem('sf_cart', JSON.stringify(updated));
      setCartItems(updated);
      const total = updated.reduce((s, i) => s + i.price * i.quantity, 0);
      setCartTotal(parseFloat(total.toFixed(2)));
      setItemCount(updated.reduce((s, i) => s + i.quantity, 0));
    }
  };

  const removeItem = async (itemId, title) => {
    try {
      const res = await removeCartItem(itemId);
      setCartItems(res.data.data);
      setCartTotal(res.data.total);
      setItemCount(res.data.itemCount);
      showToast?.(`${title || 'Item'} removed`, 'info');
    } catch {
      const local = JSON.parse(localStorage.getItem('sf_cart') || '[]').filter(i => i.id !== itemId);
      localStorage.setItem('sf_cart', JSON.stringify(local));
      setCartItems(local);
      const total = local.reduce((s, i) => s + i.price * i.quantity, 0);
      setCartTotal(parseFloat(total.toFixed(2)));
      setItemCount(local.reduce((s, i) => s + i.quantity, 0));
      showToast?.(`${title || 'Item'} removed`, 'info');
    }
  };

  const emptyCart = async () => {
    try {
      await clearCart();
    } catch {}
    localStorage.setItem('sf_cart', '[]');
    setCartItems([]);
    setCartTotal(0);
    setItemCount(0);
  };

  return (
    <CartContext.Provider value={{
      cartItems, cartTotal, itemCount, loading,
      drawerOpen, setDrawerOpen,
      addItem, updateItem, removeItem, emptyCart, loadCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
