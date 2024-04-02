'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class medical_practice extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  medical_practice.init({
    name:{
      type: DataTypes.STRING,
      allowNull:false,
      validate:{
        notEmpty:{ msg:"Name cannot be empty." },
      },   
    },
    description:{
      type: DataTypes.TEXT,
      validate:{
        notEmpty:{ msg: "Description cannot be empty." }
      }
    }
  }, {
    sequelize,
    modelName: 'medical_practice',
  });
  return medical_practice;
};