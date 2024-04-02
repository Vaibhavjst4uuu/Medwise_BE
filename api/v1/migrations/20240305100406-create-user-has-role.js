'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_has_roles', {

      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references:{
          model: "users",
          key:"id"
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      },
      roleId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references:{
          model: "roles",
          key:"id"
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      },

    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('user_has_roles');
  }
};