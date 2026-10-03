const express = require('express');
const router = express.Router();
const {
  getAdminDashboard,
  getPendingStores,
} = require('../controllers/adminController');

router.get('/dashboard', getAdminDashboard);
router.get('/pending-stores', getPendingStores);

module.exports = router;
