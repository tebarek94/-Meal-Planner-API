const { check, validationResult } = require('express-validator');

exports.registerValidator = [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  check('first_name', 'First name is required').not().isEmpty(),
  check('last_name', 'Last name is required').not().isEmpty(),
  check('role', 'Role must be either user or admin').optional().isIn(['user', 'admin'])
];

exports.loginValidator = [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists()
];

exports.userDetailsValidator = [
  check('age', 'Age is required').isInt({ min: 1, max: 120 }),
  check('weight_kg', 'Weight is required').isFloat({ min: 1, max: 300 }),
  check('height_cm', 'Height is required').isInt({ min: 50, max: 250 }),
  check('gender', 'Gender is required').isIn(['male', 'female', 'other']),
  check('activity_level', 'Activity level is required').isIn(['sedentary', 'light', 'moderate', 'active', 'very_active']),
  check('dietary_goal', 'Dietary goal is required').isIn(['weight_loss', 'weight_gain', 'maintenance', 'muscle_build']),
  check('allergies', 'Invalid allergies').optional().isArray(),
  check('cuisine_pref', 'Invalid cuisine preferences').optional().isArray()
];

exports.mealPlanValidator = [
  check('userId', 'User ID is required').isInt(),
  check('breakfast', 'Breakfast is required').not().isEmpty(),
  check('lunch', 'Lunch is required').not().isEmpty(),
  check('dinner', 'Dinner is required').not().isEmpty(),
  check('start_date', 'Start date is required').isDate(),
  check('end_date', 'End date is required').optional().isDate()
];
exports.roleUpdateValidator = [
  check('role', 'Role is required').not().isEmpty(),
  check('role', 'Role must be either user or admin').isIn(['user', 'admin'])
];