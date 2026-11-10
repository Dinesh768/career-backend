
const WalkIn = require("../models/WalkIn");

// CREATE WALK-IN INTERVIEW (Admin only)
const createWalkIn = async (req, res) => {
    try {
        const {
            title,
            company,
            location,
            interviewDate,
            startTime,
            endTime,
            venue,
            experience,
            salary,
            skills,
            contactPerson,
            contactNumber,
            requiredDocuments,
            description
        } = req.body;

        // Validate required fields
        if (
            !title ||
            !company ||
            !location ||
            !interviewDate ||
            !startTime ||
            !endTime ||
            !venue ||
            !experience ||
            !contactPerson ||
            !contactNumber ||
            !description
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields"
            });
        }

        // Validate interview date
        if (isNaN(new Date(interviewDate).getTime())) {
            return res.status(400).json({
                success: false,
                message: "Invalid interview date"
            });
        }

        // Validate interview time
        const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

        if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
            return res.status(400).json({
                success: false,
                message: "Time must be in HH:mm format"
            });
        }

        if (startTime >= endTime) {
            return res.status(400).json({
                success: false,
                message: "End time must be after start time"
            });
        }

        const walkIn = await WalkIn.create({
            title,
            company,
            location,
            interviewDate,
            startTime,
            endTime,
            venue,
            experience,
            salary,
            skills,
            contactPerson,
            contactNumber,
            requiredDocuments,
            description,
            createdBy: req.user.id
        });

        return res.status(201).json({
            success: true,
            message: "Walk-in interview created successfully",
            data: walkIn
        });

    } catch (error) {
        console.error("Create Walk-in Error:", error);

        if (error.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to create walk-in interview"
        });
    }
};


const getWalkIns = async (req, res) => {
    try {
        const walkIns = await WalkIn.find({
            status: "Active",
            interviewDate: { $gte: new Date() }
        })
        .sort({ interviewDate: 1 });

        return res.status(200).json({
            success: true,
            totalWalkIns: walkIns.length,
            data: walkIns
        });

    } catch (error) {
        console.error("Get Walk-ins Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch walk-in interviews"
        });
    }
};


const updateWalkIn = async (req, res) => {
    try {
        const { id } = req.params;

        const allowedFields = [
            "title",
            "company",
            "location",
            "interviewDate",
            "startTime",
            "endTime",
            "venue",
            "experience",
            "salary",
            "skills",
            "contactPerson",
            "contactNumber",
            "requiredDocuments",
            "description",
            "status"
        ];

        const walkIn = await WalkIn.findById(id);

        if (!walkIn) {
            return res.status(404).json({
                success: false,
                message: "Walk-in interview not found"
            });
        }

        // Update only the fields provided
        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                walkIn[field] = req.body[field];
            }
        }

        // Validate interview time
        const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

        if (
            !timeRegex.test(walkIn.startTime) ||
            !timeRegex.test(walkIn.endTime) ||
            walkIn.startTime >= walkIn.endTime
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid interview time. End time must be after start time."
            });
        }

        await walkIn.save();

        return res.status(200).json({
            success: true,
            message: "Walk-in interview updated successfully",
            data: walkIn
        });

    } catch (error) {
        console.error("Update Walk-in Error:", error);

        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid walk-in ID"
            });
        }

        if (error.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to update walk-in interview"
        });
    }
};



const deleteWalkIn = async (req, res) => {
    try {
        const { id } = req.params;

        // Find and delete walk-in interview
        const walkIn = await WalkIn.findByIdAndDelete(id);

        if (!walkIn) {
            return res.status(404).json({
                success: false,
                message: "Walk-in interview not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Walk-in interview deleted successfully"
        });

    } catch (error) {
        console.error("Delete Walk-in Error:", error);

        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid walk-in ID"
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to delete walk-in interview"
        });
    }
};


module.exports = {
    createWalkIn,
    getWalkIns,
    updateWalkIn,
    deleteWalkIn
};