import { Sequelize } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
export const up = async (queryInterface) => {
  await queryInterface.addColumn("Jobs", "description", {
    type: Sequelize.TEXT,
    allowNull: false,
  });

  await queryInterface.addColumn("Jobs", "location", {
    type: Sequelize.STRING,
    allowNull: false,
  });

  await queryInterface.addColumn("Jobs", "salaryRange", {
    type: Sequelize.STRING,
    allowNull: true,
  });

  await queryInterface.addColumn("Jobs", "employmentType", {
    type: Sequelize.ENUM("full-time", "part-time", "contract", "internship"),
    allowNull: false,
  });

  await queryInterface.addColumn("Jobs", "employerId", {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: "Users", // Ensure the correct table name
      key: "id",
    },
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  });
};

export const down = async (queryInterface) => {
  await queryInterface.removeColumn("Jobs", "description");
  await queryInterface.removeColumn("Jobs", "location");
  await queryInterface.removeColumn("Jobs", "salaryRange");
  await queryInterface.removeColumn("Jobs", "employmentType");
  await queryInterface.removeColumn("Jobs", "employerId");
};
