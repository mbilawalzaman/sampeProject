import express from "express";
import { clerkOAuthCallback } from "../Controller/authController";
import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";

const router = express.Router();

// Handle Clerk OAuth login callback
router.post("/callback", ClerkExpressWithAuth(), clerkOAuthCallback);

export default router;
