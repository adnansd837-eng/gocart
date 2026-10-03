const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  toggleProductStock,
  deleteProduct,
  getCategories,
} = require('../controllers/productController');

router.get('/', getAllProducts);
router.get('/categories', getCategories);
router.get('/:id', getProductById);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.patch('/:id/stock', toggleProductStock);
router.delete('/:id', deleteProduct);

module.exports = router;
