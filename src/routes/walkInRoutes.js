
const express = require("express");
const router = express.Router();

const {
    createWalkIn,
    getWalkIns,
    updateWalkIn,
    deleteWalkIn
} = require("../controllers/walkInController");
const {
    authMiddleware,
    authorizeRole
} = require("../middleware/authMiddleware");

// Admin only: Create walk-in
router.post(
    "/create",
    authMiddleware,
    authorizeRole("admin"),
    createWalkIn
);

// Logged-in users and admins: View walk-ins
router.get(
    "/",
    authMiddleware,
    getWalkIns
);

router.put(
    "/:id",
    authMiddleware,
    authorizeRole("admin"),
    updateWalkIn
);

// Delete walk-in (Admin only)
router.delete(
    "/:id",
    authMiddleware,
    authorizeRole("admin"),
    deleteWalkIn
);

module.exports = router;
