'use strict';

// import { Sequelize } from "sequelize";

export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn("jobs", "requirements", {
    type: Sequelize.TEXT,
    allowNull: true,
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.removeColumn("jobs", "requirements");
}
