import { Op } from "sequelize"; // ✅ Import Op
import { Job } from "../models/jobModel.js";
import JobApplication from "../models/JobApplication.js"; // ✅ Fix import
import User from "../models/userModel.js"; // ✅ Fix import
import { validationResult } from "express-validator";

const jobController = {
  // Get all jobs (with optional filters)
  getJobs: async (req, res) => {
    try {
      const jobs = await Job.findAll({
        include: [
          {
            model: User,
            as: "employer",
            attributes: ["id", "name", "email"],
          },
        ],
      });

      res.json({ jobs });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  },


  // Get single job by ID
  getJobById: async (req, res) => {
    try {
      const jobId = req.query.id; // Get job ID from query parameters
      if (!jobId) {
        return res.status(400).json({ error: "Job ID is required" });
      }

      const job = await Job.findByPk(jobId, {
        include: [
          { model: User, as: "employer", attributes: ["name", "email"] },
        ], // Removed JobApplication for now
      });

      if (!job) {
        return res.status(404).json({ error: "Job not found" });
      }

      res.json(job);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  },



  // Create new job (Admin/Employer only)
  createJob: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      if (!req.session || !req.session.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const jobData = {
        ...req.body,
        employerId: req.session.user.id,
      };

      const job = await Job.create(jobData);
      res.status(201).json({ message: "Job created successfully", job });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  },

  // Update job (Admin/Employer only)
  updateJob: async (req, res) => {
    try {
      const jobId = req.query.id; // Get job ID from query parameters
      if (!jobId) {
        return res.status(400).json({ error: "Job ID is required" });
      }

      const updatedData = req.body; // Get updated job details from request body

      const job = await Job.findByPk(jobId, {
        include: { model: User, as: "employer" }, // Include employer details
      });

      if (!job) {
        return res.status(404).json({ error: "Job not found" });
      }

      await job.update(updatedData);

      // Fetch updated job with employer info
      const updatedJob = await Job.findByPk(jobId, {
        include: { model: User, as: "employer" },
      });

      res.json({ message: "Job updated successfully", job: updatedJob });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  },



  // Delete job (Admin/Employer only)
  deleteJob: async (req, res) => {
    try {
      if (!req.session || !req.session.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const jobId = req.query.id; // Get job ID from query parameters
      if (!jobId) {
        return res.status(400).json({ error: "Job ID is required" });
      }

      const job = await Job.findByPk(jobId);
      if (!job) {
        return res.status(404).json({ error: "Job not found" });
      }

      if (req.session.user.role !== "admin" && job.employerId !== req.session.user.id) {
        return res.status(403).json({ error: "Unauthorized to delete this job" });
      }

      await job.destroy();
      res.json({ message: "Job deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  },

  // Apply for job (Authenticated users)
  //   applyForJob: async (req, res) => {
  //     try {
  //         if (!req.session || !req.session.user) {
  //             return res.status(401).json({ error: "Unauthorized" });
  //         }

  //         const { coverLetter } = req.body;
  //         const userId = req.session.user.id;
  //         const jobId = req.query.id; // Get job ID from query parameters

  //         if (!jobId) {
  //             return res.status(400).json({ error: "Job ID is required" });
  //         }

  //         const existingApplication = await JobApplication.findOne({
  //             where: { userId, jobId },
  //         });

  //         if (existingApplication) {
  //             return res.status(400).json({ error: "Already applied to this job" });
  //         }

  //         const application = await JobApplication.create({
  //             jobId,
  //             userId,
  //             coverLetter,
  //             status: "pending",
  //         });

  //         res.status(201).json({ message: "Application submitted successfully", application });
  //     } catch (err) {
  //         console.error(err);
  //         res.status(500).json({ error: "Server error" });
  //     }
  // },

  applyForJob: async (req, res) => {
    try {
      if (!req.session || !req.session.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const { coverLetter } = req.body;
      const userId = req.session.user.id;
      const jobId = req.query.id;
      const cv = req.file ? req.file.filename : null; // Get uploaded CV file name

      if (!jobId) {
        return res.status(400).json({ error: "Job ID is required" });
      }

      const existingApplication = await JobApplication.findOne({
        where: { userId, jobId },
      });

      if (existingApplication) {
        return res.status(400).json({ error: "Already applied to this job" });
      }

      const application = await JobApplication.create({
        jobId,
        userId,
        coverLetter,
        cv, // Store CV file name
        status: "pending",
      });

      res.status(201).json({ message: "Application submitted successfully", application });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  },


  // Get applications for a job (Admin/Employer only)
  getJobApplicationById: async (req, res) => {
    try {
      const { jobId } = req.query; // Use query instead of params
      if (!jobId) return res.status(400).json({ error: "Job ID is required" });

      const applications = await JobApplication.findAll({
        where: { jobId },
        include: [{ model: User, attributes: ["name", "email"] }],
      });

      res.json({ applications });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  },
  // Update get All jobs Applications (Admin/Employer only)

  getAllJobApplications: async (req, res) => {
    try {

      const user = req.session.user;
      if (!user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      let whereClause = {};
      if (user.role === "employer") {
        whereClause = {
          "$Job.employerId$": user.id // Filter by jobs posted by this employer
        };
      } else if (user.role === "user") {
        whereClause = { userId: user.id }; // Filter applications submitted by this user
      }
      const applications = await JobApplication.findAll({
        where: whereClause,
        include: [
          { model: User, attributes: ["name", "email"] }, // Applicant details
          {
            model: Job,
            attributes: ["title", "description"],
            include: [{ model: User, as: "employer", attributes: ["name"] }], // Employer name
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      res.json({ applications });
    } catch (err) {
      console.error("Error fetching applications:", err);
      res.status(500).json({ error: "Server error" });
    }
  },
  // Update application status (Admin/Employer only)
  updateApplicationStatus: async (req, res) => {
    try {
      if (!req.session || !req.session.user) {
        return res.status(401).json({ error: "Unauthorized, Please login" });
      }

      const { status } = req.body;
      const application = await JobApplication.findByPk(req.query.applicationId);
      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }

      const job = await Job.findByPk(application.jobId);

      if (req.session.user.role !== "admin" && job.employerId !== req.session.user.id) {
        return res.status(403).json({ error: "Unauthorized to update this application" });
      }

      application.status = status;
      await application.save();

      res.json({ message: "Application status updated", application });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  },
};

export default jobController;
