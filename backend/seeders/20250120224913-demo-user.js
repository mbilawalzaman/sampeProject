"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const existingUsers = await queryInterface.sequelize.query(
      "SELECT id FROM Users WHERE email IN ('john@example.com', 'admin@example.com')",
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (existingUsers.length === 0) {
      await queryInterface.bulkInsert(
        "Users",
        [
          {
            name: "John Doe",
            email: "john@example.com",
            password: "hashedpassword",
            role: "user",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            name: "Jane Doe",
            email: "admin@example.com",
            password: "hashedpassword",
            role: "admin",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        {}
      );
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
