const express = require('express');
const router = express.Router();
const { getProducts, createProduct, updateProduct, deleteProduct, getInterestRates, createInterestRate, updateInterestRate, calculateEmi } = require('../controllers/financialController');
const { protect, authorize } = require('../middleware/auth');

router.get('/products', getProducts);
router.post('/products', protect, authorize('admin'), createProduct);
router.put('/products/:id', protect, authorize('admin'), updateProduct);
router.delete('/products/:id', protect, authorize('admin'), deleteProduct);

router.get('/interest-rates', getInterestRates);
router.post('/interest-rates', protect, authorize('admin'), createInterestRate);
router.put('/interest-rates/:id', protect, authorize('admin'), updateInterestRate);

router.post('/emi-calculator', calculateEmi);

module.exports = router;
