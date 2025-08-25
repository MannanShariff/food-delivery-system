const express = require('express');
const router = express.Router();
const { 
    addCategory, deleteCategory, viewCategories,
    addFood, updateFood, deleteFood, viewFoods, searchFoods,
    viewAllOrders,
    addDeliveryDetails, viewDeliveryDetails
} = require('../controllers/adminController');

// Category routes
router.post('/categories', addCategory);
router.delete('/categories/:id', deleteCategory);
router.get('/categories', viewCategories);

// Food routes
router.post('/foods', addFood);
router.put('/foods/:id', updateFood);
router.delete('/foods/:id', deleteFood);
router.get('/foods', viewFoods);
router.get('/foods/search', searchFoods);

// Orders
router.get('/orders', viewAllOrders);

// Delivery
router.post('/delivery', addDeliveryDetails);
router.get('/delivery', viewDeliveryDetails);

module.exports = router; 