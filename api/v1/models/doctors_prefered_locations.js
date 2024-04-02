'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class doctors_prefered_locations extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  doctors_prefered_locations.init({
    doctor_id:{
      type: DataTypes.INTEGER,
      allowNull:false,
      validate:{
        notNull: {msg: "Doctor id cannot be null."},
      }
    },
    city:{
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
        notNull: {msg: "City name cannot be null."},
      }
    },
    state:{
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
        notNull: {msg:"State name cannot be null."},
      }
    }
  }, {
    sequelize,
    modelName: 'doctors_prefered_locations',
  });
  return doctors_prefered_locations;
};