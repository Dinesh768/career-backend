
const express = require("express");
const router = express.Router();

const {
    saveJob,
    getSavedJobs,
    removeSavedJob
} = require("../controllers/savedJobController");
const {
    authMiddleware
} = require("../middleware/authMiddleware");

// Save a job (logged-in users only)
router.post("/save", authMiddleware, saveJob);
router.get("/", authMiddleware, getSavedJobs);
router.delete("/:id", authMiddleware, removeSavedJob);
module.exports = router;
