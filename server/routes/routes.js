// routes.js
const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const { getUserDetails, updateUserDetails, createUserDetails } = require('../controllers/userDetailsController');
const router = express.Router();

// User Details CRUD routes
router.post('/user-details', authMiddleware, createUserDetails);
router.get('/user-details/:userId?', authMiddleware, getUserDetails);
router.put('/user-details', authMiddleware, updateUserDetails);
// router.delete('/user-details', authMiddleware, deleteUserDetails);

module.exports = router;