import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import userRoutes from "./routes/userroutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "http"; // Required for socket.io
import { Server } from "socket.io"; // Import socket.io

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app); // Create HTTP server
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Store online users
const onlineUsers = {};

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("userLoggedIn", (userId) => {
    onlineUsers[userId] = socket.id;
    console.log(`User ${userId} connected with socket ID: ${socket.id}`);

    // Send a test notification to this user
    socket.emit("notification", { message: "Welcome! You are now connected." });
  });


  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
    for (const userId in onlineUsers) {
      if (onlineUsers[userId] === socket.id) {
        delete onlineUsers[userId];
        break;
      }
    }
  });
});

const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    },
  }),
);

app.use("/api/users", userRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/uploads/cvs", express.static(path.join(__dirname, "uploads/cvs")));

// Pass `io` to be used in controllers
app.set("socketio", io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
