'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class doctor_details extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.medical_practice, { foreignKey: "practice_name"});
      this.hasMany(models.doctors_prefered_locations, {foreignKey:"doctor_id"});

    }
  }
  doctor_details.init({
    name:{
      type: DataTypes.STRING,
      allowNull:false,
      validate:{
        notNull:{ msg:"Name cannot be empty" },
      },    
    },
    gender:{
      type:DataTypes.ENUM("male", "female", "other"),
      allowNull:false,
      validate:{
        isIn: {
          args: [["male", "female", "other"]],
          msg: "must be male, female or other.",
        },
        notNull:{ msg: "gender cannot be empty" },  
      }   
    },
    contact:{
      type:DataTypes.STRING,
      allowNull:false,
      unique: {
        args:true,
        msg:"Doctor with this contact already exists" 
      },
      validate:{
        len:{
          args:[10,10],
          msg:"contact must be of length 10"
        },
        notNull:{ msg: "Contact cannot be empty" },      
      }  
    },
    bio: DataTypes.STRING,
    specialisation:{
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
        notNull:{ msg: "Specialisation cannot be empty." },  
      }
    },
    practice_name:{
      type: DataTypes.INTEGER,
      allowNull:false,
      validate:{
        notNull:{ msg: "practice_name cannot be empty." },  
      }
    },
    availability:{
      type: DataTypes.STRING,
      allowNull:false,
      validate:{
        notNull:{ msg: "availability cannot be empty." },  
      }
    },
    consultation_fee:{
      type: DataTypes.INTEGER,
      allowNull:false,
      validate:{
        notNull:{ msg: "consultation fee cannot be empty." },  
      }
    },
    rating: DataTypes.TINYINT,
    city:{
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        notNull:{ msg: "City cannot be empty." },  
      }
    },
    state:{
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        notNull:{ msg: "State cannot be empty." },  
      }
    },
    email:{
      type:DataTypes.STRING,
      unique:{
        args: true,
        msg :"Email is already in use."
      },
      allowNull: false,
      validate:{
        isEmail:{
          msg :"Please enter a valid Email Id",
        },
        notNull:{ msg:"Email cannot be empty" },
      },  
    }
  }, {
    sequelize,
    modelName: 'doctor_details',
  });
  return doctor_details;
};