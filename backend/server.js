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
    secret: process.env.SESSION_SECRET_KEY,
    resave: false, // Prevent session being saved back to the store unless modified
    saveUninitialized: false, // Don't save uninitialized sessions
    cookie: {
      maxAge: 1000 * 60, // 1 hour
      httpOnly: true, // Prevent client-side JavaScript from accessing cookies
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    },
  }),
);

// Register routes
app.use("/api/users", userRoutes); // Define routes for users

const PORT = process.env.PORT || 5000; // Default port 5000, or use the environment variable
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
