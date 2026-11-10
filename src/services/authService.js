
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// REGISTER USER
const registerUser = async (userData) => {
    const { name, email, password } = userData;

    // Check whether email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new Error("Email already registered");
    }

    // Create new user
    // Role is assigned automatically as "user"
    const user = await User.create({
        name,
        email,
        password
    });

    return {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
    };
};

// LOGIN USER
const loginUser = async (email, password) => {

    // Explicitly select password because schema has select: false
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        throw new Error("Invalid email or password");
    }

    // Compare entered password with hashed password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
        throw new Error("Invalid email or password");
    }

    // Generate JWT token
    const token = jwt.sign(
        {
            id: user._id,
            role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );

    return {
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    };
};

module.exports = {
    registerUser,
    loginUser
};
