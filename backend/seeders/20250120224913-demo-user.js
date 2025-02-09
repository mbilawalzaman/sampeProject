"use strict";

import bcrypt from "bcrypt";

export default {
  async up(queryInterface, Sequelize) {
    const saltRounds = 10;

    // Hash passwords
    const hashedPasswordUser = await bcrypt.hash("password123", saltRounds);
    const hashedPasswordAdmin = await bcrypt.hash("admin123", saltRounds);
    const hashedPasswordEmployer = await bcrypt.hash("employer123", saltRounds);

    // Log hashed passwords (optional for debugging)
    console.log({ hashedPasswordUser, hashedPasswordAdmin, hashedPasswordEmployer });

    // Insert Users
    const users = [
      {
        name: "Admin",
        email: "admin@example.com",
        password: hashedPasswordAdmin,
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "John Doe",
        email: "john@example.com",
        password: hashedPasswordUser,
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Bilawal Zaman",
        email: "bilawal@example.com",
        password: hashedPasswordUser,
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Tech Corp HR",
        email: "hr@techcorp.com",
        password: hashedPasswordEmployer,
        role: "employer",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    console.log("Users to be inserted:", users);

    await queryInterface.bulkInsert("Users", users, {});

    // Insert Jobs
    const jobs = [
      {
        title: "Senior Full-Stack Developer",
        description: "Looking for an experienced developer with Node.js and React skills",
        location: "Remote",
        salaryRange: "$80k - $120k",
        employmentType: "full-time",
        employerId: 4, // Reference to Tech Corp HR
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Junior Data Analyst",
        description: "Entry-level position for data analysis using Python and SQL",
        location: "New York",
        salaryRange: "$50k - $70k",
        employmentType: "contract",
        employerId: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "UX Designer",
        description: "Mid-level UX designer position for e-commerce platforms",
        location: "London",
        salaryRange: "£45k - £65k",
        employmentType: "part-time",
        employerId: 4, // Reference to Tech Corp HR
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    console.log("Jobs to be inserted:", jobs);

    await queryInterface.bulkInsert("Jobs", jobs, {});
  },

  async down(queryInterface, Sequelize) {
    // Clear tables in reverse order
    await queryInterface.bulkDelete("JobApplications", null, {});
    await queryInterface.bulkDelete("Jobs", null, {});
    await queryInterface.bulkDelete("Users", null, {});
  },
};
