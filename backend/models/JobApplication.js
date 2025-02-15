// models/jobApplicationModel.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./userModel.js";
import { Job } from "./jobModel.js";


const JobApplication = sequelize.define("JobApplication", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  jobId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Job,
      key: "id"
    }
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id"
    }
  },
  coverLetter: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM("pending", "reviewed", "accepted", "rejected"),
    defaultValue: "pending",
    allowNull: false
  },
  appliedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false
  },
  cv: {
    type: DataTypes.STRING, // Store file path or URL
    allowNull: true
  }  
}, {
  tableName: "job_applications",
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ["jobId", "userId"] // Prevent duplicate applications
    }
  ]
});

// Relationships
JobApplication.belongsTo(User, { foreignKey: "userId" });
JobApplication.belongsTo(Job, { foreignKey: "jobId" });

export default JobApplication;