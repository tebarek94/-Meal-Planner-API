// controllers/userDetailsController.js
const { validationResult } = require('express-validator');
const UserDetails = require('../Models/UserDetails.js');
const db = require('../config/db.js');


exports.getUserDetails = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;
    
    // Authorization check
    if (userId != req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to access these details' 
      });
    }

    const details = await UserDetails.findByUserId(userId);
    if (!details) {
      return res.status(404).json({ 
        success: false,
        message: 'User details not found' 
      });
    }

    // Convert SET fields to arrays
    const formattedDetails = {
      ...details,
      allergies: details.allergies ? details.allergies.split(',') : [],
      cuisine_pref: details.cuisine_pref ? details.cuisine_pref.split(',') : []
    };

    res.json({
      success: true,
      data: formattedDetails
    });
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user details',
      error: error.message
    });
  }
};

exports.updateUserDetails = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false,
      errors: errors.array() 
    });
  }

  try {
    const userId = req.params.userId || req.user.id;
    
    // Authorization check
    if (userId != req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to update these details' 
      });
    }

    // Prepare details data
    const details = {
      ...req.body,
      allergies: req.body.allergies ? req.body.allergies.join(',') : null,
      cuisine_pref: req.body.cuisine_pref ? req.body.cuisine_pref.join(',') : null
    };

    await UserDetails.createOrUpdate(userId, details);
    const updatedDetails = await UserDetails.findByUserId(userId);

    res.json({
      success: true,
      message: 'User details updated successfully',
      data: {
        ...updatedDetails,
        allergies: updatedDetails.allergies ? updatedDetails.allergies.split(',') : [],
        cuisine_pref: updatedDetails.cuisine_pref ? updatedDetails.cuisine_pref.split(',') : []
      }
    });
  } catch (error) {
    console.error('Error updating user details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user details',
      error: error.message
    });
  }
};
exports.createUserDetails = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false,
      errors: errors.array() 
    });
  }

  try {
    const userId = req.user.id;

    // First check if user exists
    const [user] = await db.execute('SELECT id FROM users WHERE id = ?', [userId]);
    if (!user.length) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if details already exist
    const existingDetails = await UserDetails.findByUserId(userId);
    if (existingDetails) {
      return res.status(400).json({
        success: false,
        message: 'User details already exist - use update instead'
      });
    }

    // Validate required fields
    if (!req.body.age || !req.body.activity_level || !req.body.dietary_goal) {
      return res.status(400).json({
        success: false,
        message: 'Age, activity level and dietary goal are required'
      });
    }

    // Prepare details data
    const details = {
      ...req.body,
      allergies: req.body.allergies ? req.body.allergies.join(',') : null,
      cuisine_pref: req.body.cuisine_pref ? req.body.cuisine_pref.join(',') : null
    };

    await UserDetails.createOrUpdate(userId, details);
    const userDetails = await UserDetails.findByUserId(userId);

    res.status(201).json({
      success: true,
      message: 'User details created successfully',
      data: {
        ...userDetails,
        allergies: userDetails.allergies ? userDetails.allergies.split(',') : [],
        cuisine_pref: userDetails.cuisine_pref ? userDetails.cuisine_pref.split(',') : []
      }
    });
  } catch (error) {
    console.error('Error creating user details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create user details',
      error: error.message
    });
  }
};
