const express = require('express');
const router = express.Router();
const { getCart, addToCart, updateCartItem, removeFromCart, clearCart } = require('../controllers/cartController');
const authMiddleware = require('../middleware/auth');

// Optional auth — cart works for both guests and authenticated users
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const jwt = require('jsonwebtoken');
    const JWT_SECRET = process.env.JWT_SECRET || 'starflex_super_secret_key_2024';
    try {
      const token = authHeader.split(' ')[1];
      req.user = jwt.verify(token, JWT_SECRET);
    } catch (e) {
      // Token invalid, proceed as guest
    }
  }
  next();
};

router.get('/', optionalAuth, getCart);
router.post('/', optionalAuth, addToCart);
router.put('/:itemId', optionalAuth, updateCartItem);
router.delete('/clear', optionalAuth, clearCart);
router.delete('/:itemId', optionalAuth, removeFromCart);

module.exports = router;
