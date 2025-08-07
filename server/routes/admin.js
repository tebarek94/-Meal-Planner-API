const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController.js');
const { auth, admin } = require('../middleware/auth.js');
const {
  roleUpdateValidator
} = require('../middleware/validators.js');

// Admin-only routes
router.get('/users', auth, admin, adminController.getAllUsers);
router.put('/users/:id/role', auth, admin, roleUpdateValidator, adminController.updateUserRole);
router.delete('/users/:id', auth, admin, adminController.deleteUser);
router.delete('/users/:id', auth, admin, adminController.deleteUser);

// Meal plan admin routes
router.get('/meal-plans', auth, admin, adminController.getAllMealPlans);

module.exports = router;