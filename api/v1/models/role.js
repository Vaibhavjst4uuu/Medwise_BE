'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

    }
  }
  role.init({
    name:{
      type: DataTypes.STRING,
      allowNull:false,
      validate:{
        notNull:{ msg:"Name cannot be empty." },
      },   
    },
    description:{
      type: DataTypes.TEXT,
      allowNull:false,
      validate:{
        notNull:{ msg: "Description cannot be empty." }
      }
    }
  }, {
    sequelize,
    modelName: 'role',
  });
  return role;
};