// controllers/userController.js
const bcrypt = require("bcrypt");
const User = require("../Models/User.js");
const UserDetails = require("../Models/UserDetails.js");
const pool = require("../config/db.js");
const saltRounds = 10;

exports.register = async (req, res) => {
  try {
    const { email, password, first_name, last_name, role = 'user' } = req.body;

    // Validate required fields with more specific checks
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email is required' });
    }
    
    if (!password || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ error: 'Password must be a string with at least 6 characters' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert user with role
    const [result] = await pool.query(
      'INSERT INTO users (email, password_hash, first_name, last_name, role) VALUES (?, ?, ?, ?, ?)',
      [email, hashedPassword, first_name || null, last_name || null, role]
    );

    res.status(201).json({ 
      success: true,
      userId: result.insertId 
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      error: 'Registration failed',
      message: error.message 
    });
  }
};

exports.submitDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    const details = req.body;
    await UserDetails.create(userId, details);
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};