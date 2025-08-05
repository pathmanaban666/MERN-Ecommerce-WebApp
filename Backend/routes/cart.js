const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const authenticateToken = require('./middleware/protected');

router.post('/cart', authenticateToken, async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.id;

  try {
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [{ product: productId, quantity }],
      });
    } else {
      const itemIndex = cart.items.findIndex(item => item.product.equals(productId));
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }
    }

    await cart.save();
    res.json({ message: 'Item added to cart' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add item to cart' });
  }
});

router.get('/cart', authenticateToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    res.json(cart ? cart.items : []);
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve cart items' });
  }
});

router.delete('/cart', authenticateToken, async (req, res) => {
  const { productId } = req.body;
  const userId = req.user.id;

  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter(item => item.product.toString() !== productId);
    await cart.save();

    res.json({ message: 'Item removed from cart' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to remove item from cart' });
  }
});

module.exports = router;
