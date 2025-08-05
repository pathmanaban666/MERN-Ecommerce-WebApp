const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authenticateToken = require('./middleware/protected'); 

const COOKIE_NAME = 'token';

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already registered' });
    }
    const hashed = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email: email.toLowerCase(), password: hashed });
    await newUser.save();
    res.status(200).json({ message: 'User registered successfully' });
  } 
  catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
});


router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'Lax',
    secure: false,  
    maxAge: 3600000,
  });
  res.json({ message: 'Logged in' });
});


router.get('/auth-check', authenticateToken, (req, res) => {
  res.json({ message: 'Authenticated', isAuthenticated: true, user: req.user });
});


router.post('/logout', (req, res) => {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    sameSite: 'Lax',
    secure: false,
    maxAge: 0,
  });
  res.json({ message: 'Logged out successfully' });
});


router.get('/account', authenticateToken, async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ message: 'User authenticated', user: { username: user.username, email: user.email } });
});


router.patch('/account/update', authenticateToken, async (req, res) => {
  const { username } = req.body;
  if (!username || username.trim() === '') {
    return res.status(400).json({ message: 'Username cannot be empty.' });
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { username: username.trim() },
      { new: true, runValidators: true }
    ).select('-password');
    res.json({ user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update username.' });
  }
});

module.exports = router;
