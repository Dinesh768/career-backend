
const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
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

        jobType: {
            type: String,
            enum: ["Full Time", "Part Time", "Internship", "Contract"],
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

        description: {
            type: String,
            required: true
        },

        skills: {
            type: [String],
            default: []
        },

        source: {
            type: String,
            enum: ["Admin", "LinkedIn", "Naukri", "Indeed", "Other"],
            default: "Admin"
        },

        sourceUrl: {
            type: String,
            default: ""
        },

        status: {
            type: String,
            enum: ["Active", "Inactive", "Expired"],
            default: "Active"
        },

        postedAt: {
            type: Date,
            default: Date.now
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Job", jobSchema);
