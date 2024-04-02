'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user_has_role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.user, { foreignKey: "userId" });
      this.belongsTo(models.role, { foreignKey: "roleId" });

    }
  }
  user_has_role.init({
    userId:{
      type: DataTypes.INTEGER,
      allowNull:false,
      validate:{
        notEmpty:{ msg: "user_id cannot be empty." },  
      }
    },
    roleId:{
      type: DataTypes.INTEGER,
      allowNull:false,
      validate:{
        notEmpty:{ msg: "role_id cannot be empty." },  
      }
    }
  }, {
    sequelize,
    timestamps:false,
    modelName: 'user_has_role',
  });
  user_has_role.removeAttribute("id");
  return user_has_role;
};