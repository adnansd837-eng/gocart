const express = require('express');
const router = express.Router();
const {
  getAllStores,
  getStoreById,
  getStoreByUsername,
  getStoreByUserId,
  createStore,
  updateStoreStatus,
  toggleStoreActive,
  getStoreDashboard,
} = require('../controllers/storeController');

router.get('/', getAllStores);
router.post('/', createStore);
router.get('/username/:username', getStoreByUsername);
router.get('/user/:userId', getStoreByUserId);
router.get('/:id', getStoreById);
router.get('/:id/dashboard', getStoreDashboard);
router.patch('/:id/status', updateStoreStatus);
router.patch('/:id/active', toggleStoreActive);

module.exports = router;
