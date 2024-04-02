'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'profile_pic', {
      type: Sequelize.STRING,
      allowNull: true, // or false, depending on your requirements
    });
  },

  async down (queryInterface, Sequelize) {

    await queryInterface.removeColumn('users','profile_pic');
  }
};
