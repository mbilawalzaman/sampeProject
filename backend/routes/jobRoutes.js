import express from "express";
import jobController from "../controller/jobController.js"; // Ensure correct case
import { isAuthenticated, authorizedRole } from "../middleware/authMiddleware.js"; // Import the middleware

console.log("jobController:", jobController);
console.log("jobController.getJobs:", jobController?.getJobs);

const router = express.Router();
router.get("/getAllJobs", isAuthenticated, jobController.getJobs);

router.post("/createJob", isAuthenticated,authorizedRole, jobController.createJob);

export default router; // ✅ Correct export
