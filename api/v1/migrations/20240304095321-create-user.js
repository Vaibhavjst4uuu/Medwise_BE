'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      fName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      lName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        unique:true,
        allowNull: false
      },
      password:{
        type: Sequelize.STRING,
        allowNull: false
      },
      DOB: {
        type: Sequelize.DATE,
        allowNull: false
      },
      gender: {
        type: Sequelize.ENUM("male", "female", "other"),
        allowNull: false
      },
      address: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      contact: {
        type: Sequelize.STRING,
        allowNull:false,
        unique:true
      },
      medical_practice_prefered: {
        type: Sequelize.INTEGER,
        allowNull:true,
        references:{
          model: 'medical_practices',
          key: 'id'
        },
        onDelete: "SET NULL",  // if the doctor is deleted set null in db
        onUpdate: "CASCADE"    // If the doctor is updated also update here
      },
      login_img: {
        type: Sequelize.STRING,
      },
      insurance_provider: {
        type: Sequelize.STRING,
        allowNull: true
      },
      insurance_policy_number: {
        type: Sequelize.STRING,
        allowNull: true,
        unique:true
      },
      medical_history: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      allergies: {
        type: Sequelize.STRING,
        allowNull: true
      },
      current_medications: {
        type: Sequelize.STRING,
        allowNull: true
      },
      city:{
        type:Sequelize.STRING,
        allowNull:false
      },
      state:{
        type:Sequelize.STRING,
        allowNull:false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        defaultValue:null,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};