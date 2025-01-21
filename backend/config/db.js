import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

// Load the correct environment configuration
const env = process.env.NODE_ENV || "development"; // Default to 'development' if NODE_ENV is not set
import config from "./config.js";

// Extract configuration based on environment
const { username, password, database, host, dialect } = config[env];

// Initialize Sequelize instance
const sequelize = new Sequelize(database, username, password, {
  host,
  dialect,
  logging: console.log, // Optional: Log SQL queries to the console
});

// Test the connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

export default sequelize;
