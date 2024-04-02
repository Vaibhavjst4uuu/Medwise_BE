'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('roles', [{
         name: 'Super Admin',
         description: 'This is the super admin role.',
         createdAt: new Date(),
       },
       {
        name: 'Admin',
        description: 'This is an admin user that can manage users and roles',
        createdAt: new Date()
       },
       {
        name: 'User',
        description: 'This is an user who can read only or manipulate his/her data',
        createdAt: new Date()
       }], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('roles', null, {});
  }
};
