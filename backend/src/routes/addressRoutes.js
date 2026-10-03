const express = require('express');
const router = express.Router();
const {
  getUserAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
} = require('../controllers/addressController');

router.get('/user/:userId', getUserAddresses);
router.post('/', createAddress);
router.put('/:id', updateAddress);
router.delete('/:id', deleteAddress);

module.exports = router;
