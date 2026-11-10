
const dns = require("node:dns");

// Use public DNS servers for MongoDB SRV lookup
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            dbName: "career"
        });

        console.log("MongoDB Connected Successfully");
        console.log("Connected Database:", mongoose.connection.name);

    } catch (error) {
        console.error("MongoDB Connection Failed:", error);
        process.exit(1);
    }
};

module.exports = connectDB;
