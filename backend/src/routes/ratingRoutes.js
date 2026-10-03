const express = require('express');
const router = express.Router();
const {
  getProductRatings,
  addRating,
} = require('../controllers/ratingController');

router.get('/product/:productId', getProductRatings);
router.post('/', addRating);

module.exports = router;
