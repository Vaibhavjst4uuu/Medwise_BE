'use strict';
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
    //  Add seed commands here.
    const vaibhavHashedPassword = await bcrypt.hash('Vaibhav@123', 10);
    const sanjeetHashedPassword = await bcrypt.hash('Sanjeet@123', 10);


     await queryInterface.bulkInsert('users', [{
       fName: 'Vaibhav',
       lName: 'Raj',
       email:'vaibhavraj@gmail.com',
       password: vaibhavHashedPassword,
       contact:'9113392709',
       DOB: new Date("2000-07-18"),
       gender: "male",
       address:'sector 3B Qr No-542',
       city: "Bokaro Steel City",
       state: "Jharkhand",
       createdAt: new Date(),
       
     },
    {
      fName:"Sanjeet",
      lName:"Kumar",
      email:"sanjeet@gmail.com",
      password:sanjeetHashedPassword,
      contact:'9457960186',
      DOB:new Date("1995-04-06") ,
      gender:"male",
      address:'sarojni Delhi 6',
      city:"Delhi",
      state:"Delhi",
      createdAt: new Date(),
    }], {});
    
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('users', null, {});
  }
};
