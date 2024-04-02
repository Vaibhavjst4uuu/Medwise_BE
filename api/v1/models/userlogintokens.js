'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserLoginTokens extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  UserLoginTokens.init({
    userId: {
      type:DataTypes.INTEGER,
      allowNull:false,
      validate:{
        notEmpty:{msg: "User ID cannot be empty"}
      }
    },
    token:{
      type: DataTypes.STRING,
      allowNull:false,
      validate:{
        notEmpty:{msg:"Token cannot be empty"},
      }
    }
  }, {
    sequelize,
    modelName: 'UserLoginTokens',
  });
  return UserLoginTokens;
};