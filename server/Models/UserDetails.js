// models/UserDetails.js
const db = require('../config/db.js');

class UserDetails {
  /**
   * Creates or updates user details
   * @param {number} userId - The ID of the user
   * @param {object} details - User details object
   * @returns {Promise<object>} Database result
   */
  static async createOrUpdate(userId, details) {
    try {
      // First verify user exists
      const [user] = await db.execute('SELECT id FROM users WHERE id = ?', [userId]);
      if (!user.length) {
        throw new Error('User does not exist');
      }

      // Check if details already exist
      const [existing] = await db.execute(
        'SELECT id FROM user_details WHERE user_id = ?',
        [userId]
      );

      if (existing.length > 0) {
        // Update existing details
        const [result] = await db.execute(
          `UPDATE user_details SET 
            age = ?, 
            weight_kg = ?, 
            height_cm = ?, 
            gender = ?, 
            activity_level = ?, 
            dietary_goal = ?, 
            allergies = ?, 
            cuisine_pref = ?,
            updated_at = CURRENT_TIMESTAMP
          WHERE user_id = ?`,
          [
            details.age || null,
            details.weight_kg || null,
            details.height_cm || null,
            details.gender || null,
            details.activity_level,
            details.dietary_goal,
            details.allergies || null,
            details.cuisine_pref || null,
            userId
          ]
        );
        return result;
      } else {
        // Create new details
        const [result] = await db.execute(
          `INSERT INTO user_details 
          (user_id, age, weight_kg, height_cm, gender, activity_level, dietary_goal, allergies, cuisine_pref) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            userId,
            details.age,
            details.weight_kg || null,
            details.height_cm || null,
            details.gender || null,
            details.activity_level,
            details.dietary_goal,
            details.allergies || null,
            details.cuisine_pref || null
          ]
        );
        return result;
      }
    } catch (error) {
      console.error('Error in createOrUpdate:', error);
      throw error;
    }
  }

  /**
   * Finds user details by user ID
   * @param {number} userId - The ID of the user
   * @returns {Promise<object|null>} User details or null if not found
   */
  static async findByUserId(userId) {
    try {
      const [rows] = await db.execute(
        'SELECT * FROM user_details WHERE user_id = ?',
        [userId]
      );
      return rows[0] || null;
    } catch (error) {
      console.error('Error in findByUserId:', error);
      throw error;
    }
  }

  /**
   * Deletes user details
   * @param {number} userId - The ID of the user
   * @returns {Promise<object>} Database result
   */
  static async deleteByUserId(userId) {
    try {
      const [result] = await db.execute(
        'DELETE FROM user_details WHERE user_id = ?',
        [userId]
      );
      return result;
    } catch (error) {
      console.error('Error in deleteByUserId:', error);
      throw error;
    }
  }

  /**
   * Gets all user details (admin only)
   * @returns {Promise<array>} Array of all user details
   */
  static async findAll() {
    try {
      const [rows] = await db.execute(
        'SELECT * FROM user_details ORDER BY updated_at DESC'
      );
      return rows;
    } catch (error) {
      console.error('Error in findAll:', error);
      throw error;
    }
  }

  /**
   * Checks if user details exist
   * @param {number} userId - The ID of the user
   * @returns {Promise<boolean>} True if details exist
   */
  static async exists(userId) {
    try {
      const [rows] = await db.execute(
        'SELECT 1 FROM user_details WHERE user_id = ?',
        [userId]
      );
      return rows.length > 0;
    } catch (error) {
      console.error('Error in exists:', error);
      throw error;
    }
  }
}

module.exports = UserDetails;