import express from "express";
import userController from "../Controller/userController.js";
import { isAuthenticated } from "../middleware/authMiddleware.js"; // Import the middleware

const router = express.Router();

// Example route (no authentication required)
router.get("/message", userController.getMessage);

router.get("/session-check", userController.checkSession);

// Protected route: Fetch all users (requires authentication)
router.get("/getUsers", isAuthenticated, userController.getUsers);

// Protected route: Fetch a user by ID (requires authentication)
router.get("/:id", isAuthenticated, userController.getUserById);

// Unprotected route: Create a new user (no authentication required)
router.post("/createUser", userController.createUser);

// Unprotected route: Login (no authentication required)
router.post("/login", userController.login);

// Protected route: Logout (requires authentication)
router.post("/logout", isAuthenticated, userController.logout);

export default router;
