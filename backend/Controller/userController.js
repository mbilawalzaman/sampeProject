import dotenv from "dotenv";
import db from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { randomBytes } from "crypto";

dotenv.config();

const userController = {
  // Fetch all users
  getUsers: async (req, res) => {
    try {
      const [rows] = await db.query("SELECT * FROM users");
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).send("Database error");
    }
  },

  // Add a new user
  createUser: async (req, res) => {
    const saltRounds = 10;
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "Name, Email, and Password are required!" });
    }

    try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Save the user to the database
      await db.query(
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        [name, email, hashedPassword],
      );

      res.status(201).json({ message: "User created successfully!" });
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  },

  getUserById: async (req, res) => {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "User ID is required!" });
    }

    try {
      // Query the database for the user
      const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [id]);

      if (rows.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json(rows[0]); // Send the first user object
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  },

  login: async (req, res) => {
    const { email, password } = req.body;

    try {
      // Check if user exists in the database
      const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
        email,
      ]);

      // If no user found
      if (rows.length === 0) {
        return res.status(400).json({ error: "Invalid credentials" });
      }

      // Get the first user (because query returns an array of rows)
      const user = rows[0];

      // Check if the password matches the hashed password in the database
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: "Invalid credentials" });
      }

      // Create JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET_KEY, // Use the secret key from the .env file
        { expiresIn: "1h" }, // Token expires in 1 hour
      );

      // Store user session
      req.session.user = { id: user.id, email: user.email }; // Store user info in the session

      // Send the token and success message
      res.json({ message: "Login successful", token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  },

  // Logout method to clear session
  logout: (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to logout" });
      }
      res.json({ message: "Logged out successfully" });
    });
  },
  // Example: Additional route for testing
  getMessage: async (req, res) => {
    const randomKey = randomBytes(32).toString("hex"); // Convert the bytes to a hex string

    console.log("Generated random key:", randomKey);
    console.log("Message route hit"); // Add this line for debugging
    res.json({ message: "Hello from the controller!" });
  },
};

export default userController;
