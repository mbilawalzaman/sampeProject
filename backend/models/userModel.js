import { Sequelize, DataTypes } from "sequelize";
import sequelize from "../config/db.js"; // Your database connection file

const User = sequelize.define(
  "User",
  {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING, // Add this if it doesn't exist
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM("admin", "user"), // Restrict roles to "admin" and "user"
      defaultValue: "user", // Default role for new sign-ups
      allowNull: false,
    },
    // Add other fields as needed
  },
  {
    tableName: "users", // Specify the table name
    timestamps: false, // Disable timestamps if not required
  },
);

export default User;
