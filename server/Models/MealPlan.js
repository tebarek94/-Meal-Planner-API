// models/mealPlan.js
const db = require('../config/db.js');

class MealPlan {
  static async create({ user_id, assigned_by, breakfast, lunch, dinner, snacks, notes, start_date, end_date }) {
    // Ensure all optional fields are properly set to null if undefined
    const [result] = await db.execute(
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
    return result.insertId;
  }

  static async findById(id) {
    const [rows] = await db.execute(
      'SELECT * FROM meal_plans WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  static async findByUserId(userId) {
    const [rows] = await db.execute(
      'SELECT * FROM meal_plans WHERE user_id = ? ORDER BY start_date DESC',
      [userId]
    );
    return rows;
  }

  static async update(id, updates) {
    const [result] = await db.execute(
      `UPDATE meal_plans SET 
        breakfast = ?, lunch = ?, dinner = ?, snacks = ?, notes = ?, 
        start_date = ?, end_date = ?
      WHERE id = ?`,
      [
        updates.breakfast,
        updates.lunch,
        updates.dinner,
        updates.snacks || null,
        updates.notes || null,
        updates.start_date,
        updates.end_date || null,
        id
      ]
    );
    return result.affectedRows;
  }

  static async delete(id) {
    const [result] = await db.execute(
      'DELETE FROM meal_plans WHERE id = ?',
      [id]
    );
    return result.affectedRows;
  }

  static async findAll() {
    const [rows] = await db.execute(
      `SELECT mp.*, u.email as user_email, a.email as assigned_by_email 
       FROM meal_plans mp
       JOIN users u ON mp.user_id = u.id
       JOIN users a ON mp.assigned_by = a.id
       ORDER BY mp.start_date DESC`
    );
    return rows;
  }

  static async findPendingRequests() {
    const [rows] = await db.execute(
      `SELECT mp.*, u.email as user_email, a.email as assigned_by_email 
       FROM meal_plans mp
       JOIN users u ON mp.user_id = u.id
       JOIN users a ON mp.assigned_by = a.id
       WHERE mp.status = 'pending'
       ORDER BY mp.start_date DESC`
    );
    return rows;
  }

  static async assign(userId, mealPlanId) {
    const [result] = await db.execute(
      'UPDATE meal_plans SET user_id = ?, status = ? WHERE id = ?',
      [userId, 'assigned', mealPlanId]
    );
    return result.affectedRows;
  }
}

module.exports = MealPlan;