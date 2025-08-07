const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController.js');
const userDetailsController = require('../controllers/userDetailsController.js');
const mealPlanController = require('../controllers/mealPlanController.js');
const { auth, admin } = require('../middleware/auth.js');
const {
  registerValidator,
  loginValidator,
  mealPlanValidator
} = require('../middleware/validators.js');

// Auth routes
router.post('/register', registerValidator, authController.register);
router.post('/login', loginValidator, authController.login);
router.get('/me', auth, authController.getMe);
// Meal plan routes
router.post('/meal-plans', auth, mealPlanValidator, mealPlanController.createMealPlan);
router.get('/meal-plans', auth, mealPlanController.getMealPlans);
router.get('/meal-plans/:id', auth, mealPlanController.getMealPlanById);
router.put('/meal-plans/:id', auth, mealPlanValidator, mealPlanController.updateMealPlan);
router.delete('/meal-plans/:id', auth, mealPlanController.deleteMealPlan);
router.use('/admin', require('./admin.js'));
router.use('/adminroutes', require('./adminRoutes.js'));
router.use('/user-details', require('./routes.js'));


module.exports = router;