
const User = require("../models/User");

// Admin creates a new user
const createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters"
            });
        }

        // Check if email already exists
        const existingUser = await User.findOne({
            email: email.toLowerCase().trim()
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email already exists"
            });
        }

        // Create user with default role
        const user = await User.create({
            name,
            email,
            password,
            role: "user"
        });

        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Create User Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create user"
        });
    }
};

module.exports = { createUser };
