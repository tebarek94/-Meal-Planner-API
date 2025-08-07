const MealPlan = require('../models/mealPlan.js');
const { validationResult } = require('express-validator');

exports.createMealPlan = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { userId, breakfast, lunch, dinner, snacks, notes, start_date, end_date } = req.body;
    
    // Check if admin or assigning to self
    if (userId != req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to create meal plans for others' });
    }

    const mealPlanId = await MealPlan.create({
      userId,
      assignedBy: req.user.id,
      breakfast,
      lunch,
      dinner,
      snacks,
      notes,
      start_date,
      end_date
    });

    const mealPlan = await MealPlan.findById(mealPlanId);
    res.status(201).json(mealPlan);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getMealPlans = async (req, res) => {
  try {
    let mealPlans;
    
    if (req.user.role === 'admin') {
      // Admin can see all meal plans
      mealPlans = await MealPlan.findAll();
    } else {
      // Regular users can only see their own meal plans
      mealPlans = await MealPlan.findByUserId(req.user.id);
    }

    res.json(mealPlans);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getMealPlanById = async (req, res) => {
  try {
    const mealPlan = await MealPlan.findById(req.params.id);
    if (!mealPlan) {
      return res.status(404).json({ message: 'Meal plan not found' });
    }

    // Check if user is admin or owns the meal plan
    if (mealPlan.user_id != req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(mealPlan);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateMealPlan = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const mealPlan = await MealPlan.findById(req.params.id);
    if (!mealPlan) {
      return res.status(404).json({ message: 'Meal plan not found' });
    }

    // Check if user is admin or assigned the meal plan
    if (mealPlan.assigned_by != req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this meal plan' });
    }

    const result = await MealPlan.update(req.params.id, req.body);
    if (result === 0) {
      return res.status(404).json({ message: 'Meal plan not found' });
    }

    const updatedMealPlan = await MealPlan.findById(req.params.id);
    res.json(updatedMealPlan);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteMealPlan = async (req, res) => {
  try {
    const mealPlan = await MealPlan.findById(req.params.id);
    if (!mealPlan) {
      return res.status(404).json({ message: 'Meal plan not found' });
    }

    // Check if user is admin or assigned the meal plan
    if (mealPlan.assigned_by != req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this meal plan' });
    }

    const result = await MealPlan.delete(req.params.id);
    if (result === 0) {
      return res.status(404).json({ message: 'Meal plan not found' });
    }

    res.json({ message: 'Meal plan deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};