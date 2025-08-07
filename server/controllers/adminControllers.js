// controllers/adminController.js
const db = require('../config/db.js');
const MealPlan = require('../models/mealPlan.js');
const User = require('../Models/User.js');

// Get all pending meal plan requests
exports.getPendingRequests = async (req, res) => {
  try {
    const [pendingUsers] = await db.query(`
      SELECT 
        u.id as user_id, 
        u.email, 
        u.first_name, 
        u.last_name,
        ud.age,
        ud.weight_kg,
        ud.height_cm,
        ud.gender,
        ud.activity_level,
        ud.dietary_goal,
        ud.allergies,
        ud.cuisine_pref
      FROM users u
      JOIN user_details ud ON u.id = ud.user_id
      LEFT JOIN meal_plans mp ON u.id = mp.user_id
      WHERE mp.id IS NULL AND u.role = 'user'
    `);

    res.json({
      success: true,
      data: pendingUsers
    });
  } catch (error) {
    console.error('Error fetching pending requests:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pending requests',
      error: error.message
    });
  }
};

// Assign a meal plan to a user
exports.assignMealPlan = async (req, res) => {
  try {
    const { user_id, breakfast, lunch, dinner, snacks, notes, start_date, end_date } = req.body;
    const assigned_by = req.user.id;

    // Validate required fields
    if (!user_id || !breakfast || !lunch || !dinner || !start_date) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields (user_id, breakfast, lunch, dinner, start_date)'
      });
    }

    // Check if user exists
    const [user] = await db.query('SELECT * FROM users WHERE id = ?', [user_id]);
    if (!user.length) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Create the meal plan with explicit null for optional fields
    const [result] = await db.query(
      `INSERT INTO meal_plans 
       (user_id, assigned_by, breakfast, lunch, dinner, snacks, notes, start_date, end_date) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user_id,
        assigned_by,
        breakfast,
        lunch,
        dinner,
        snacks || null,
        notes || null,
        start_date,
        end_date || null
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Meal plan assigned successfully',
      data: {
        meal_plan_id: result.insertId
      }
    });
  } catch (error) {
    console.error('Error assigning meal plan:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to assign meal plan',
      error: error.message
    });
  }
};

// Get all meal plans (admin dashboard)
exports.getAllMealPlans = async (req, res) => {
  try {
    const [mealPlans] = await db.query(`
      SELECT 
        mp.*,
        u.email as user_email,
        u.first_name as user_first_name,
        u.last_name as user_last_name,
        admin.first_name as admin_first_name,
        admin.last_name as admin_last_name
      FROM meal_plans mp
      JOIN users u ON mp.user_id = u.id
      JOIN users admin ON mp.assigned_by = admin.id
      ORDER BY mp.created_at DESC
    `);

    res.json({
      success: true,
      data: mealPlans
    });
  } catch (error) {
    console.error('Error fetching meal plans:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch meal plans',
      error: error.message
    });
  }
};

// Get single meal plan by ID
exports.getMealPlanById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [mealPlan] = await db.query(`
      SELECT 
        mp.*,
        u.email as user_email,
        u.first_name as user_first_name,
        u.last_name as user_last_name
      FROM meal_plans mp
      JOIN users u ON mp.user_id = u.id
      WHERE mp.id = ?
    `, [id]);

    if (!mealPlan.length) {
      return res.status(404).json({
        success: false,
        message: 'Meal plan not found'
      });
    }

    res.json({
      success: true,
      data: mealPlan[0]
    });
  } catch (error) {
    console.error('Error fetching meal plan:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch meal plan',
      error: error.message
    });
  }
};

// Update a meal plan
exports.updateMealPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { breakfast, lunch, dinner, snacks, notes, start_date, end_date } = req.body;

    // Validate required fields
    if (!breakfast || !lunch || !dinner || !start_date) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields (breakfast, lunch, dinner, start_date)'
      });
    }

    // Update the meal plan
    const [result] = await db.query(`
      UPDATE meal_plans 
      SET 
        breakfast = ?,
        lunch = ?,
        dinner = ?,
        snacks = ?,
        notes = ?,
        start_date = ?,
        end_date = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [
      breakfast,
      lunch,
      dinner,
      snacks || null,
      notes || null,
      start_date,
      end_date || null,
      id
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Meal plan not found'
      });
    }

    res.json({
      success: true,
      message: 'Meal plan updated successfully'
    });
  } catch (error) {
    console.error('Error updating meal plan:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update meal plan',
      error: error.message
    });
  }
};

// Delete a meal plan
exports.deleteMealPlan = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query('DELETE FROM meal_plans WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Meal plan not found'
      });
    }

    res.json({
      success: true,
      message: 'Meal plan deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting meal plan:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete meal plan',
      error: error.message
    });
  }
};