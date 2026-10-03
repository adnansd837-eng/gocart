const express = require('express');
const router = express.Router();
const {
  getAllCoupons,
  createCoupon,
  validateCoupon,
  deleteCoupon,
} = require('../controllers/couponController');

router.get('/', getAllCoupons);
router.post('/', createCoupon);
router.post('/validate', validateCoupon);
router.delete('/:code', deleteCoupon);

module.exports = router;
