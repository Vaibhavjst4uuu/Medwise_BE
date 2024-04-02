'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class chat_logs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  chat_logs.init({
    user_id:{
      type: DataTypes.INTEGER,
      allowNull:false,
      validate:{
        notNull:{ msg: "user id cannot be empty." },  
      }
    },
    message:{
      type:DataTypes.TEXT,
      allowNull:false,
      validate:{
        notNull:{ msg:"Message can't be empty" }
      }
    },
    sender:{
      type:DataTypes.STRING,
      allowNull: false,
      validate:{
        notNull:{ msg: "Sender field can't be empty" },
        isIn:{
          args:[["User","Bot"]],
          msg: "Invalid Sender must be between User or Bot"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'chat_logs',
  });
  return chat_logs;
};