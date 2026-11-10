
const SavedJob = require("../models/SavedJob");
const Job = require("../models/Job");

// SAVE JOB
const saveJob = async (req, res) => {
    try {
        const { jobId } = req.body;
        const userId = req.user.id;

        // Validate job ID
        if (!jobId) {
            return res.status(400).json({
                success: false,
                message: "Please provide job ID"
            });
        }

        // Check whether job exists and is active
        const job = await Job.findOne({
            _id: jobId,
            status: "Active"
        });

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Active job not found"
            });
        }

        // Check whether user already saved this job
        const existingSavedJob = await SavedJob.findOne({
            user: userId,
            job: jobId
        });

        if (existingSavedJob) {
            return res.status(409).json({
                success: false,
                message: "Job is already saved"
            });
        }

        // Save job
        const savedJob = await SavedJob.create({
            user: userId,
            job: jobId
        });

        return res.status(201).json({
            success: true,
            message: "Job saved successfully",
            data: savedJob
        });

    } catch (error) {
        console.error("Save Job Error:", error);

        // Handle duplicate requests safely
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Job is already saved"
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to save job"
        });
    }
};


const getSavedJobs = async (req, res) => {
    try {
        const userId = req.user.id;

        const savedJobs = await SavedJob.find({
            user: userId
        })
        .populate("job")
        .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            totalSavedJobs: savedJobs.length,
            data: savedJobs
        });

    } catch (error) {
        console.error("Get Saved Jobs Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch saved jobs"
        });
    }
};


const removeSavedJob = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const savedJob = await SavedJob.findOneAndDelete({
            _id: id,
            user: userId
        });

        if (!savedJob) {
            return res.status(404).json({
                success: false,
                message: "Saved job not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Saved job removed successfully"
        });

    } catch (error) {
        console.error("Remove Saved Job Error:", error);

        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid saved job ID"
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to remove saved job"
        });
    }
};


module.exports = {
    saveJob,
    getSavedJobs,
    removeSavedJob
};
