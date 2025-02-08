"use strict";

import bcrypt from "bcrypt";

export default {
  async up(queryInterface, Sequelize) {
    const saltRounds = 10;

    const hashedPasswordUser = await bcrypt.hash("password123", saltRounds); // Password for John
    const hashedPasswordAdmin = await bcrypt.hash("admin123", saltRounds); // Password for Jane

    await queryInterface.bulkInsert(
      "Users",
      [
        {
          name: "Admin",
          email: "admin@example.com",
          password: hashedPasswordAdmin,
          role: "admin",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          name: "John Doe",
          email: "john@example.com",
          password: hashedPasswordUser,
          role: "user",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3,
          name: "Bilawal Zaman",
          email: "bilawal@example.com",
          password: hashedPasswordUser,
          role: "user",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
