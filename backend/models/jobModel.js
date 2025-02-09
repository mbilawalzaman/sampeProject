import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./userModel.js"; // Ensure User is imported before being referenced

// Job Model
const Job = sequelize.define("Job", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  salaryRange: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  employmentType: {
    type: DataTypes.ENUM("full-time", "part-time", "contract", "internship"),
    allowNull: false,
  },
  requirements: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  employerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "users", // Use the table name instead of the model reference
      key: "id",
    },
  },
}, {
  tableName: "jobs",
  timestamps: true, // Ensure createdAt and updatedAt are enabled
});

// Job Application Model
const JobApplication = sequelize.define("JobApplication", {
  status: {
    type: DataTypes.ENUM("pending", "reviewed", "accepted", "rejected"),
    defaultValue: "pending",
  },
  coverLetter: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: "job_applications",
  timestamps: true,
});

// Define Relationships
User.hasMany(Job, { foreignKey: "employerId", as: "postedJobs" });
Job.belongsTo(User, { foreignKey: "employerId", as: "employer" });

User.belongsToMany(Job, {
  through: JobApplication,
  as: "applications",
  foreignKey: "userId",
});
Job.belongsToMany(User, {
  through: JobApplication,
  as: "applicants",
  foreignKey: "jobId",
});

export { Job, JobApplication };