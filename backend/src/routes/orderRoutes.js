const express = require('express');
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getStoreOrders,
  getOrderById,
  updateOrderStatus,
  updatePaymentStatus,
} = require('../controllers/orderController');

router.post('/', createOrder);
router.get('/user/:userId', getUserOrders);
router.get('/store/:storeId', getStoreOrders);
router.get('/:id', getOrderById);
router.patch('/:id/status', updateOrderStatus);
router.patch('/:id/payment', updatePaymentStatus);

module.exports = router;
