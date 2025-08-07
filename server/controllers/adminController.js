// const User = require('../models/user');
const { validationResult } = require('express-validator');
const { auth, admin } = require('../middleware/auth.js');
const User = require('../Models/User.js');
const MealPlan = require('../models/mealPlan.js');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateUserRole = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { role } = req.body;
    const userId = req.params.id;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const result = await User.updateRole(userId, role);
    if (result === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const updatedUser = await User.findById(userId);
    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Prevent admin from deleting themselves
    if (userId == req.user.id) {
      return res.status(400).json({ message: 'Cannot delete yourself' });
    }

    const result = await User.delete(userId);
    if (result === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllMealPlans = async (req, res) => {
  try {
    const mealPlans = await MealPlan.findAll();
    res.json(mealPlans);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
// Get all pending meal plan requests
exports.getPendingRequests = async (req, res) => {
  try {
    const pendingRequests = await MealPlan.findPendingRequests();
    res.json(pendingRequests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
// Assign a meal plan to a user
exports.assignMealPlan = async (req, res) => {
  const errors = validationResult(req);
  if (!errors){
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { userId, mealPlanId } = req.body;
    const result = await MealPlan.assign(userId, mealPlanId);
    if (result === 0) {
      return res.status(404).json({ message: 'User or meal plan not found' });
    }
    res.json({ message: 'Meal plan assigned successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }

}