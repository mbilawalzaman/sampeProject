import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { randomBytes } from "crypto";
import User from "../models/userModel.js"; // Import Sequelize models

dotenv.config();

const userController = {
  // Fetch all users
  getUsers: async (req, res) => {
    try {
      const users = await User.findAll(); // Fetch all users using Sequelize
      res.json(users);
    } catch (err) {
      console.error(err);
      res.status(500).send("Database error");
    }
  },

  // Add a new user
  createUser: async (req, res) => {
    const saltRounds = 10;
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "Name, Email, and Password are required!" });
    }

    // Restrict `role` field for sign-ups (users cannot register as admin)
    if (role && role === "admin") {
      return res.status(403).json({ error: "Cannot sign up as admin!" });
    }

    try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Save the user to the database
      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: role || "user", // Default to "user" if role is not provided
      });

      res.status(201).json({ message: "User created successfully!", user });
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  },

  updateUser: async (req, res) => {
    const { id } = req.params;
    const { name, email, password, role } = req.body;

    if (!id) {
      return res.status(400).json({ error: "User ID is required!" });
    }

    // Validate at least one field to update
    if (!name && !email && !password && !role) {
      return res.status(400).json({
        error: "At least one field (name, email, password, or role) is required to update!",
      });
    }

    try {
      const user = await User.findByPk(id);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Prevent unauthorized role updates (only admins can change roles)
      if (role && req.session.user.role !== "admin") {
        return res
          .status(403)
          .json({ error: "You are not authorized to update the role!" });
      }

      // Update user fields
      if (name) user.name = name;
      if (email) user.email = email;
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
      }
      if (role) user.role = role;

      // Save the updated user to the database
      await user.save();

      res.status(200).json({ message: "User updated successfully", user });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  },

  getUserById: async (req, res) => {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "User ID is required!" });
    }

    try {
      // Query the database for the user
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json(user);
      console.log(res);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  },

  login: async (req, res) => {
    const { email, password } = req.body;

    try {
      // Check if user exists in the database
      const user = await User.findOne({ where: { email } });

      // If no user found
      if (!user) {
        return res.status(400).json({ error: "Invalid credentials" });
      }

      // Check if the password matches the hashed password in the database
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: "Invalid credentials" });
      }

      // Create JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "1h" },
      );

      // Store user session
      req.session.user = { id: user.id, email: user.email }; // Store user info in the session

      // Send the token and success message
      res.json({
        message: "Login successful",
        token,
        user: req.session.user, // Include session user info in the response
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  },

  getMessage: async (req, res) => {
    const randomKey = randomBytes(32).toString("hex"); // Generate a random key
    console.log("Generated random key:", randomKey);

    res.json({ message: "Hello from the controller!", randomKey });
  },

  logout: (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to logout" });
      }
      res.json({ message: "Logged out successfully" });
    });
  },
  // Check session controller
  checkSession: (req, res) => {
    if (req.session.user) {
      // User is authenticated
      res.json({ isAuthenticated: true, user: req.session.user });
    } else {
      // No valid session
      res.json({ isAuthenticated: false });
    }
  },
};

export default userController;
