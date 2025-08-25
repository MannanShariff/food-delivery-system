const express = require('express');
const router = express.Router();
const { 
    viewFoodsByCategory, searchFoods,
    addToCart, removeFromCart, viewCart,
    placeOrder, viewOrders,
    viewDeliveryDetails
} = require('../controllers/customerController');

// Foods
router.get('/foods', viewFoodsByCategory);
router.get('/foods/search', searchFoods);

// Cart
router.post('/cart', addToCart);
router.delete('/cart/:id', removeFromCart);
router.get('/cart', viewCart);

// Orders
router.post('/orders', placeOrder);
router.get('/orders', viewOrders);

// Delivery
router.get('/delivery', viewDeliveryDetails);

module.exports = router; 