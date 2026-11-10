
const express = require("express");
const router = express.Router();

const {
    createUser
} = require("../controllers/adminUserController");

const {
    authMiddleware,
    authorizeRole
} = require("../middleware/authMiddleware");

// Only logged-in admins can create users
router.post(
    "/create",
    authMiddleware,
    authorizeRole("admin"),
    createUser
);

module.exports = router;
