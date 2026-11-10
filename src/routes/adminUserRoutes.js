const express = require("express");
const router = express.Router();

const { createUser } = require("../controllers/adminUserController");

const {
    authMiddleware,
    authorizeRole
} = require("../middleware/authMiddleware");

router.post(
    "/create",
    authMiddleware,
    authorizeRole("admin"),
    createUser
);

module.exports = router;