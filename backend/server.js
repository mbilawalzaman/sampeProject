import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session"; // Import express-session
import userRoutes from "./routes/userroutes.js"; // Import user routes (note the .js extension)

dotenv.config();

const app = express();

// Configure CORS
const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:3000", // Frontend URL, replace with actual URL in production
  methods: ["GET", "POST", "PUT", "DELETE"], // Allowed methods
  credentials: true, // Allow cookies to be sent with requests
};

app.use(cors(corsOptions)); // Use CORS with options

// Middleware to parse JSON requests
app.use(express.json());
app.use(bodyParser.json());

// Session middleware configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET_KEY, // Secret key for encrypting the session ID cookie
    resave: false, // Do not save session if unmodified
    saveUninitialized: false, // Do not create a session until something is stored
    cookie: {
      httpOnly: true, // Ensures the cookie is not accessible via JavaScript (Security)
      secure: process.env.NODE_ENV === "production", // Ensure secure cookies in production
      maxAge: 1000 * 60, // 1 hour session expiry
    },
  }),
);

// Register routes
app.use("/api/users", userRoutes); // Define routes for users

const PORT = process.env.PORT || 5000; // Default port 5000, or use the environment variable
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
