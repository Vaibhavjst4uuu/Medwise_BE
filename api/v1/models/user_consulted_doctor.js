'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user_consulted_doctor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  user_consulted_doctor.init({
    user_id:{
      type: DataTypes.INTEGER,
      allowNull:false,
      validate:{
        notNull:{ msg: "user_id cannot be empty." },  
      }
    },
    doctor_id:{
      type: DataTypes.INTEGER,
      allowNull:false,
      validate:{
        notNull:{ msg: "doctor_id cannot be empty." },  
      }
    },
    consultation_date:{
      type: DataTypes.DATE,
      allowNull:false,
      defaultValue:DataTypes.NOW,
      validate:{
        notNull:{ msg: "Consultation date cannot be empty." },
      }
    },
    consulatation_reason:{
      type: DataTypes.TEXT,
      allowNull:false,
      validate:{
        notNull:{
          msg:"Consultation reason can't be empty."
        }
      }
    }
  }, {
    sequelize,
    modelName: 'user_consulted_doctor',
  });
  return user_consulted_doctor;
};