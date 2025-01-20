"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Users",
      [
        {
          name: "John Doe",
          email: "john@example.com",
          password: "hashedpassword", // Hash password using bcrypt in real applications
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Jane Doe",
          email: "jane@example.com",
          password: "hashedpassword", // Hash password using bcrypt in real applications
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
