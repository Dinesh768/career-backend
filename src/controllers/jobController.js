

const Job = require("../models/Job");

// CREATE JOB (Admin only)
const createJob = async (req, res) => {
    try {
        const {
            title,
            company,
            location,
            jobType,
            experience,
            salary,
            description,
            skills,
            source,
            sourceUrl
        } = req.body;

        if (
            !title ||
            !company ||
            !location ||
            !jobType ||
            !experience ||
            !description
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields"
            });
        }

        const job = await Job.create({
            title,
            company,
            location,
            jobType,
            experience,
            salary,
            description,
            skills,
            source: source || "Admin",
            sourceUrl,
            createdBy: req.user.id
        });

        return res.status(201).json({
            success: true,
            message: "Job created successfully",
            data: job
        });

    } catch (error) {
        console.error("Create Job Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create job"
        });
    }
};





// GET JOBS WITH SEARCH AND PERIOD FILTERS
// const getJobs = async (req, res) => {
//     try {
//         const {
//             period = "all",
//             search,
//             company,
//             location,
//             jobType,
//             experience,
//             skill
//         } = req.query;

//         const now = new Date();

//         // Base filter: Active jobs only
//         const filter = {
//             status: "Active"
//         };

//         // Search by title, company, location or skills
//         if (search && search.trim()) {
//             const keyword = search.trim();

//             filter.$or = [
//                 { title: { $regex: keyword, $options: "i" } },
//                 { company: { $regex: keyword, $options: "i" } },
//                 { location: { $regex: keyword, $options: "i" } },
//                 { skills: { $regex: keyword, $options: "i" } }
//             ];
//         }

//         // Company filter
//         if (company && company.trim()) {
//             filter.company = {
//                 $regex: company.trim(),
//                 $options: "i"
//             };
//         }

//         // Location filter
//         if (location && location.trim()) {
//             filter.location = {
//                 $regex: location.trim(),
//                 $options: "i"
//             };
//         }

//         // Job type filter
//         if (jobType) {
//             filter.jobType = jobType;
//         }

//         // Experience filter
//         if (experience && experience.trim()) {
//             filter.experience = {
//                 $regex: experience.trim(),
//                 $options: "i"
//             };
//         }

//         // Skills filter
//         if (skill && skill.trim()) {
//             filter.skills = {
//                 $regex: skill.trim(),
//                 $options: "i"
//             };
//         }

//         // Calculate today's date in IST
//         const istDate = new Intl.DateTimeFormat("en-CA", {
//             timeZone: "Asia/Kolkata",
//             year: "numeric",
//             month: "2-digit",
//             day: "2-digit"
//         }).format(now);

//         const startOfToday = new Date(
//             `${istDate}T00:00:00+05:30`
//         );

//         let startDate = null;

//         // Period filter
//         switch (period) {
//             case "today":
//                 startDate = startOfToday;
//                 break;

//             case "7days":
//                 startDate = new Date(
//                     now.getTime() - 7 * 24 * 60 * 60 * 1000
//                 );
//                 break;

//             case "30days":
//                 startDate = new Date(
//                     now.getTime() - 30 * 24 * 60 * 60 * 1000
//                 );
//                 break;

//             case "3months":
//                 startDate = new Date(now);
//                 startDate.setMonth(startDate.getMonth() - 3);
//                 break;

//             case "all":
//                 break;

//             default:
//                 return res.status(400).json({
//                     success: false,
//                     message: "Invalid period"
//                 });
//         }

//         if (period === "today") {
//             const endOfToday = new Date(
//                 startOfToday.getTime() + 24 * 60 * 60 * 1000
//             );

//             filter.postedAt = {
//                 $gte: startOfToday,
//                 $lt: endOfToday
//             };

//         } else if (startDate) {
//             filter.postedAt = {
//                 $gte: startDate,
//                 $lte: now
//             };
//         }

//         // Fetch filtered jobs
//         const jobs = await Job.find(filter)
//             .sort({ postedAt: -1 });

//         return res.status(200).json({
//             success: true,
//             period,
//             totalJobs: jobs.length,
//             filters: {
//                 search,
//                 company,
//                 location,
//                 jobType,
//                 experience,
//                 skill
//             },
//             data: jobs
//         });

//     } catch (error) {
//         console.error("Get Jobs Error:", error);

//         return res.status(500).json({
//             success: false,
//             message: "Failed to fetch jobs"
//         });
//     }
// };



const getJobs = async (req, res) => {
    try {
        const {
            period = "all",
            search,
            company,
            location,
            jobType,
            experience,
            skill
        } = req.query;

        // Pagination
        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const limit = Math.min(
            Math.max(parseInt(req.query.limit) || 10, 1),
            50
        );
        const skip = (page - 1) * limit;

        const now = new Date();

        // Base filter: Active jobs only
        const filter = {
            status: "Active"
        };

        // Search by title, company, location or skills
        if (search && search.trim()) {
            const keyword = search.trim();

            filter.$or = [
                { title: { $regex: keyword, $options: "i" } },
                { company: { $regex: keyword, $options: "i" } },
                { location: { $regex: keyword, $options: "i" } },
                { skills: { $regex: keyword, $options: "i" } }
            ];
        }

        // Company filter
        if (company && company.trim()) {
            filter.company = {
                $regex: company.trim(),
                $options: "i"
            };
        }

        // Location filter
        if (location && location.trim()) {
            filter.location = {
                $regex: location.trim(),
                $options: "i"
            };
        }

        // Job type filter
        if (jobType) {
            filter.jobType = jobType;
        }

        // Experience filter
        if (experience && experience.trim()) {
            filter.experience = {
                $regex: experience.trim(),
                $options: "i"
            };
        }

        // Skills filter
        if (skill && skill.trim()) {
            filter.skills = {
                $regex: skill.trim(),
                $options: "i"
            };
        }

        // Calculate today's date in IST
        const istDate = new Intl.DateTimeFormat("en-CA", {
            timeZone: "Asia/Kolkata",
            year: "numeric",
            month: "2-digit",
            day: "2-digit"
        }).format(now);

        const startOfToday = new Date(
            `${istDate}T00:00:00+05:30`
        );

        let startDate = null;

        // Period filter
        switch (period) {
            case "today":
                startDate = startOfToday;
                break;

            case "7days":
                startDate = new Date(
                    now.getTime() - 7 * 24 * 60 * 60 * 1000
                );
                break;

            case "30days":
                startDate = new Date(
                    now.getTime() - 30 * 24 * 60 * 60 * 1000
                );
                break;

            case "3months":
                startDate = new Date(now);
                startDate.setMonth(startDate.getMonth() - 3);
                break;

            case "all":
                break;

            default:
                return res.status(400).json({
                    success: false,
                    message: "Invalid period"
                });
        }

        if (period === "today") {
            const endOfToday = new Date(
                startOfToday.getTime() + 24 * 60 * 60 * 1000
            );

            filter.postedAt = {
                $gte: startOfToday,
                $lt: endOfToday
            };

        } else if (startDate) {
            filter.postedAt = {
                $gte: startDate,
                $lte: now
            };
        }

        // Count all matching jobs
        const totalJobs = await Job.countDocuments(filter);

        // Calculate total pages
        const totalPages = Math.ceil(totalJobs / limit);

        // Fetch jobs for the requested page
        const jobs = await Job.find(filter)
            .sort({ postedAt: -1 })
            .skip(skip)
            .limit(limit);

        return res.status(200).json({
            success: true,
            period,
            totalJobs,
            pagination: {
                currentPage: page,
                limit,
                totalPages,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1
            },
            filters: {
                search,
                company,
                location,
                jobType,
                experience,
                skill
            },
            data: jobs
        });

    } catch (error) {
        console.error("Get Jobs Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch jobs"
        });
    }
};


// UPDATE JOB (Admin only)
const updateJob = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            title,
            company,
            location,
            jobType,
            experience,
            salary,
            description,
            skills,
            source,
            sourceUrl,
            status
        } = req.body;

        // Find job by ID
        const job = await Job.findById(id);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }

        // Update only fields provided in request
        const allowedFields = [
            "title",
            "company",
            "location",
            "jobType",
            "experience",
            "salary",
            "description",
            "skills",
            "source",
            "sourceUrl",
            "status"
        ];

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                job[field] = req.body[field];
            }
        }

        await job.save();

        return res.status(200).json({
            success: true,
            message: "Job updated successfully",
            data: job
        });

    } catch (error) {
        console.error("Update Job Error:", error);

        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid job ID"
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
            message: "Failed to update job"
        });
    }
};


// DELETE JOB (Admin only)
const deleteJob = async (req, res) => {
    try {
        const { id } = req.params;

        const job = await Job.findById(id);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }

        await Job.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "Job deleted successfully"
        });

    } catch (error) {
        console.error("Delete Job Error:", error);

        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid job ID"
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to delete job"
        });
    }
};




module.exports = {
    createJob,
    getJobs,
    updateJob,
    deleteJob
};