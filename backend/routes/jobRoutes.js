import express from "express";
import jobController from "../controller/jobController.js"; // Ensure correct case
import { isAuthenticated, authorizedRole } from "../middleware/authMiddleware.js"; // Import the middleware
import upload from "../middleware/upload.js";


const router = express.Router();
router.get("/getAllJobs", isAuthenticated, jobController.getJobs);

router.post("/createJob", isAuthenticated,authorizedRole, jobController.createJob);

router.get("/getJobById", isAuthenticated, jobController.getJobById);


router.put("/updateJob", isAuthenticated, jobController.updateJob);


router.delete("/deleteJob", isAuthenticated, jobController.deleteJob);


// JOb Application

// router.post("/applyForJob", isAuthenticated, jobController.applyForJob);
router.post("/applyForJob", isAuthenticated, upload.single("cv"), jobController.applyForJob);


router.get("/getJobApplicationById", jobController.getJobApplicationById);

router.get("/getAllJobApplications",isAuthenticated, jobController.getAllJobApplications);


router.put("/updateApplicationStatus", jobController.updateApplicationStatus);







export default router; // ✅ Correct export
