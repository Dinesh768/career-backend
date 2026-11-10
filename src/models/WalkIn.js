
const mongoose = require("mongoose");

const walkInSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        company: {
            type: String,
            required: true,
            trim: true
        },
        location: {
            type: String,
            required: true,
            trim: true
        },
        interviewDate: {
            type: Date,
            required: true
        },
        startTime: {
            type: String,
            required: true
        },
        endTime: {
            type: String,
            required: true
        },
        venue: {
            type: String,
            required: true
        },
        experience: {
            type: String,
            required: true
        },
        salary: {
            type: String,
            default: "Not Disclosed"
        },
        skills: {
            type: [String],
            default: []
        },
        contactPerson: {
            type: String,
            required: true
        },
        contactNumber: {
            type: String,
            required: true
        },
        requiredDocuments: {
            type: [String],
            default: []
        },
        description: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ["Active", "Inactive", "Expired"],
            default: "Active"
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("WalkIn", walkInSchema);
