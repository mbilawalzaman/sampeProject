import dotenv from "dotenv";

dotenv.config(); // Load environment variables from the .env file

export default {
  development: {
    username: process.env.DB_USER, // Fallback to 'root' if not provided
    password: process.env.DB_PASSWORD, // Fallback to null if not provided
    database: process.env.DB_NAME, // Default database name
    host: process.env.DB_HOST, // Default to localhost
    dialect: "mysql", // Specify MySQL as the dialect
    port: process.env.DB_PORT, // Default MySQL port
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.TEST_DB_NAME, // Default test database
    host: process.env.DB_HOST,
    dialect: "mysql",
    port: process.env.DB_PORT,
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.PROD_DB_NAME, // Default production database
    host: process.env.DB_HOST,
    dialect: "mysql",
    port: process.env.DB_PORT,
  },
};
