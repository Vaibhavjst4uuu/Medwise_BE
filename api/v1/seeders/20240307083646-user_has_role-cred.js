'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
    //  Add seed commands here.
    
     await queryInterface.bulkInsert('user_has_roles', [{
      userId:1,
      roleId:1
     },
    {
      userId:2,
      roleId:2
    }], {});
    
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('user_has_roles', null, {});
  }
};
