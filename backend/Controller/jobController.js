import { Op } from "sequelize"; // ✅ Import Op
import { Job } from "../models/jobModel.js";
import JobApplication from "../models/JobApplication.js"; // ✅ Fix import
import User from "../models/userModel.js"; // ✅ Fix import
import { validationResult } from "express-validator";

const jobController = {
  // Get all jobs (with optional filters)
  getJobs: async (req, res) => {
    console.log("here")
    try {
      const jobs = await Job.findAll();
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

        const job = await Job.findByPk(jobId);
        if (!job) {
            return res.status(404).json({ error: "Job not found" });
        }

        await job.update(updatedData);

        res.json({ message: "Job updated successfully", job });
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
  applyForJob: async (req, res) => {
    try {
        if (!req.session || !req.session.user) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const { coverLetter } = req.body;
        const userId = req.session.user.id;
        const jobId = req.query.id; // Get job ID from query parameters

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
            status: "pending",
        });

        res.status(201).json({ message: "Application submitted successfully", application });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
},

  // Get applications for a job (Admin/Employer only)
  getJobApplications: async (req, res) => {
    try {
      const applications = await JobApplication.findAll({
        where: { jobId: req.params.jobId },
        include: [{ model: User, attributes: ["name", "email"] }],
      });

      res.json({ applications });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  },

  // Update application status (Admin/Employer only)
  updateApplicationStatus: async (req, res) => {
    try {
      if (!req.session || !req.session.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const { status } = req.body;
      const application = await JobApplication.findByPk(req.params.applicationId);
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
