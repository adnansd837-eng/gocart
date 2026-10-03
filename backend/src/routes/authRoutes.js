const express = require('express');
const router = express.Router();
const {
  registerUser,
  getUserProfile,
  updateUserCart,
  listUsers,
} = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', registerUser); // Login/sync
router.get('/user/:id', getUserProfile);
router.put('/user/:id/cart', updateUserCart);
router.get('/users', listUsers);

module.exports = router;
