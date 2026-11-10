require("dotenv").config();

const connectDB = require("../config/database");
const User = require("../models/User");

const createAdmin = async () => {
    try {
        await connectDB();

        const existingAdmin = await User.findOne({
            email: "admin@careerkhoj.com"
        });

        if (existingAdmin) {
            console.log("Admin already exists");
            process.exit(0);
        }

        await User.create({
            name: "Admin",
            email: "admin@careerkhoj.com",
            password: "Admin@123456",
            role: "admin"
        });

        console.log("Admin created successfully");
        process.exit(0);

    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

createAdmin();