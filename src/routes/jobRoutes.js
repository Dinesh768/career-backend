
const express = require("express");
const router = express.Router();

const {
    createJob,
    getJobs,
    updateJob,
    deleteJob
} = require("../controllers/jobController");

const {
    authMiddleware,
    authorizeRole
} = require("../middleware/authMiddleware");

// Create Job (Admin only)
router.post(
    "/create",
    authMiddleware,
    authorizeRole("admin"),
    createJob
);

// Get Jobs with period filters
router.get("/", getJobs);

// Update Job (Admin only)
router.put(
    "/:id",
    authMiddleware,
    authorizeRole("admin"),
    updateJob
);

// Delete Job (Admin only)
router.delete(
    "/:id",
    authMiddleware,
    authorizeRole("admin"),
    deleteJob
);

module.exports = router;
