const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const cartPath = path.join(__dirname, '../data/cart.json');
const productsPath = path.join(__dirname, '../data/products.json');

const ensureDataDir = () => {
  const dir = path.dirname(cartPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const readCart = () => {
  try {
    ensureDataDir();
    if (!fs.existsSync(cartPath)) return {};
    return JSON.parse(fs.readFileSync(cartPath, 'utf-8'));
  } catch {
    return {};
  }
};

const writeCart = (data) => {
  ensureDataDir();
  fs.writeFileSync(cartPath, JSON.stringify(data, null, 2));
};

const calculateCartStats = (items) => {
  const products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));
  
  // Update prices from source of truth
  const updatedItems = items.map(item => {
    const p = products.find(prod => prod.id === item.productId);
    if (p) {
      return { ...item, price: p.price, title: p.title, image: p.image };
    }
    return item;
  });

  const total = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
  
  return { updatedItems, total: parseFloat(total.toFixed(2)), itemCount };
};

// GET /cart
const getCart = (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : req.headers['x-session-id'] || 'guest';
    const allCarts = readCart();
    const userCart = allCarts[userId] || [];

    const { updatedItems, total, itemCount } = calculateCartStats(userCart);

    res.json({ success: true, data: updatedItems, total, itemCount });
  } catch (err) {
    next(err);
  }
};

// POST /cart
const addToCart = (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : req.headers['x-session-id'] || 'guest';
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: 'productId is required' });
    }

    const products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));
    const product = products.find((p) => p.id === productId);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const allCarts = readCart();
    if (!allCarts[userId]) allCarts[userId] = [];

    const existingItem = allCarts[userId].find((item) => item.productId === productId);

    if (existingItem) {
      existingItem.quantity += parseInt(quantity);
    } else {
      allCarts[userId].push({
        id: uuidv4(),
        productId,
        title: product.title,
        price: product.price,
        image: product.image,
        quantity: parseInt(quantity),
        category: product.category,
      });
    }

    writeCart(allCarts);

    const { updatedItems, total, itemCount } = calculateCartStats(allCarts[userId]);

    res.status(201).json({
      success: true,
      message: `${product.title} added to cart`,
      data: updatedItems,
      total,
      itemCount,
    });
  } catch (err) {
    next(err);
  }
};

// PUT /cart/:itemId
const updateCartItem = (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : req.headers['x-session-id'] || 'guest';
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (quantity === undefined || quantity < 0) {
      return res.status(400).json({ success: false, message: 'Valid quantity required' });
    }

    const allCarts = readCart();
    if (!allCarts[userId]) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    if (parseInt(quantity) === 0) {
      allCarts[userId] = allCarts[userId].filter((item) => item.id !== itemId);
    } else {
      const item = allCarts[userId].find((item) => item.id === itemId);
      if (!item) return res.status(404).json({ success: false, message: 'Cart item not found' });
      item.quantity = parseInt(quantity);
    }

    writeCart(allCarts);

    const cartItems = allCarts[userId];
    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    res.json({ success: true, data: cartItems, total: parseFloat(total.toFixed(2)), itemCount });
  } catch (err) {
    next(err);
  }
};

// DELETE /cart/:itemId
const removeFromCart = (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : req.headers['x-session-id'] || 'guest';
    const { itemId } = req.params;

    const allCarts = readCart();
    if (!allCarts[userId]) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    allCarts[userId] = allCarts[userId].filter((item) => item.id !== itemId);
    writeCart(allCarts);

    const { updatedItems, total, itemCount } = calculateCartStats(allCarts[userId]);

    res.json({ success: true, message: 'Item removed', data: updatedItems, total, itemCount });
  } catch (err) {
    next(err);
  }
};

// DELETE /cart (clear cart)
const clearCart = (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : req.headers['x-session-id'] || 'guest';
    const allCarts = readCart();
    allCarts[userId] = [];
    writeCart(allCarts);
    res.json({ success: true, message: 'Cart cleared', data: [], total: 0, itemCount: 0 });
  } catch (err) {
    next(err);
  }
};

// Merge carts for guest sessions
const mergeCarts = (guestId, userId) => {
  if (!guestId || !userId || guestId === userId || guestId === 'guest') return;

  const allCarts = readCart();
  const guestCart = allCarts[guestId] || [];
  const userCart = allCarts[userId] || [];

  if (guestCart.length === 0) return;

  guestCart.forEach((guestItem) => {
    const existing = userCart.find((uItem) => uItem.productId === guestItem.productId);
    if (existing) {
      existing.quantity += guestItem.quantity;
    } else {
      userCart.push(guestItem);
    }
  });

  allCarts[userId] = userCart;
  delete allCarts[guestId];
  writeCart(allCarts);
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart, mergeCarts };
