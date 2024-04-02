'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('doctor_details', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull:false
      },
      gender: {
        type: Sequelize.ENUM("male","female","other"),
        allowNull:false
      },
      contact: {
        type: Sequelize.STRING,
        allowNull:false,
        unique:true
        
      },
      bio: {
        type: Sequelize.STRING,
        allowNull:true
      },
      specialisation: {
        type: Sequelize.STRING,
        allowNull:false
      },
      practice_name: {
        type: Sequelize.INTEGER,
        allowNull:false,
        references:{
          model:'medical_practices',
          key:'id'
        },
        onDelete:'CASCADE',
        onUpdate:'CASCADE'
        
      },
      availability: {
        type: Sequelize.STRING,
        allowNull:false
      },
      consultation_fee: {
        type: Sequelize.INTEGER,
        allowNull:false
      },
      rating: {
        type: Sequelize.TINYINT,
        allowNull:true
      },
      city: {
        type: Sequelize.STRING,
        allowNull:false
      },
      state: {
        type: Sequelize.STRING,
        allowNull:false
      },
      email:{
        type:Sequelize.STRING,
        allowNull:false,
        unique:true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('doctor_details');
  }
};