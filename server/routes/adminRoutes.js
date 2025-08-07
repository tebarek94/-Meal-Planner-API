// routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminControllers.js");
const { authMiddleware, adminMiddleware } = require("../middleware/auth.js");
// const { authMiddleware, adminMiddleware } = require("../middleware/auth.js");

router.get(
  "/pending-requests",
  authMiddleware,
  adminMiddleware,
  adminController.getPendingRequests
);
router.post(
  "/assign-meal-plan",
  authMiddleware,
  adminMiddleware,
  adminController.assignMealPlan
);
router.get(
  "/meal-plans",
  authMiddleware,
  adminMiddleware,
  adminController.getAllMealPlans
);

// Update a specific meal plan
router.put(
  "/meal-plans/:id",
  authMiddleware,
  adminMiddleware,
  adminController.updateMealPlan
);

// Delete a specific meal plan
router.delete(
  "/meal-plans/:id",
  authMiddleware,
  adminMiddleware,
  adminController.deleteMealPlan
);

module.exports = router;
