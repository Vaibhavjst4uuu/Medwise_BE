"use strict";
const bcrypt = require("bcrypt");
const { Op, ValidationError, ValidationErrorItem } = require("sequelize");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.role, {
        through: models.user_has_role,
      });

      this.belongsTo(models.medical_practice, {
        foreignKey: "medical_practice_prefered",
        as: "preferredMedicalPractice",
      });
    }
  }
  user.init(
    {
      fName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "First name cannot be null",
          },
        },
      },
      lName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Last name cannot be null",
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        unique: {
          args: true,
          msg: "Email is already in use.",
        },
        allowNull: false,
        validate: {
          isEmail: {
            msg: "Please enter a valid Email Id",
          },
          notNull: {
            msg: "Email cannot be empty",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Password cannot be empty" },
        },
      },

      DOB: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Please provide your Date of Birth.",
          },
        },
      },
      gender: {
        type: DataTypes.ENUM("male", "female", "other"),
        allowNull: false,
        validate: {
          isIn: {
            args: [["male", "female", "other"]],
            msg: "must be male, female or other.",
          },
          notNull: {
            msg: "gender must be selected",
          },
        },
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Address must be provided.",
          },
        },
      },
      contact: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          args: true,
          msg: "User with this contact already exists",
        },
        validate: {
          len: {
            args: [10, 10],
            msg: "contact must be of length 10",
          },
          notNull: {
            msg: "Contact details cannot be empty",
          },
        },
      },
      medical_practice_prefered: DataTypes.INTEGER,
      login_img: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue:1,
        validate: {
          notNull: {
            msg: "login image must be uploaded.",
          },
        },
      },
      insurance_provider: DataTypes.STRING,
      insurance_policy_number: DataTypes.STRING,
      medical_history: DataTypes.TEXT,
      allergies: DataTypes.STRING,
      current_medications: DataTypes.STRING,
      city: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "City cannot be empty",
          },
        },
      },
      state: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "State cannot be empty",
          },
        },
      },
      status: {
        type: DataTypes.ENUM("active", "inactive"),
        allowNull: false,
        defaultValue: "active",
      },
      profile_pic: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      resetToken: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
    },
    {
      sequelize,
      modelName: "user",
    }
  );

  // Define a hook to hash the password before saving
  // user.beforeCreate(async (user) => {
  //   const { password } = user;

  // // Validate password format
  // if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/)) {
  //   throw new ValidationError('Password must contain at least one lowercase letter, one uppercase letter, one numeric digit, one special character, and be at least 8 characters long.', [
  //     new ValidationErrorItem('Password must contain at least one lowercase letter, one uppercase letter, one numeric digit, one special character, and be at least 8 characters long.', 'unique violation', 'password', password, user, 'not_valid'),
  //   ]);
  // }

  // // Validate no HTML tags
  // if (password.match(/<[a-z][\s\S]*>/i)) {
  //   throw new ValidationError('Password must not contain HTML tags.', [
  //     new ValidationErrorItem('Password must not contain HTML tags.', 'unique violation', 'password', password, user, 'not_valid_password'),
  //   ]);
  // }

  //   // Hash the password
  //   const hashedPassword = await bcrypt.hash(password, 10);
  //   user.password = hashedPassword;
  // });
  user.beforeCreate(async (user) => {
    const { password } = user;

    let errorMessage;
  
    switch (true) {
      case password.length < 8:
        errorMessage = 'Password must be at least 8 characters long.';
        break;
      case !/[a-z]/.test(password):
        errorMessage = 'Password must contain at least one lowercase letter.';
        break;
      case !/[A-Z]/.test(password):
        errorMessage = 'Password must contain at least one uppercase letter.';
        break;
      case !/\d/.test(password):
        errorMessage = 'Password must contain at least one numeric digit.';
        break;
      case !/[$@$!%*?&]/.test(password):
        errorMessage = 'Password must contain at least one special character.';
        break;
      case password.match(/<[a-z][\s\S]*>/i):
        errorMessage = 'Password must not contain HTML tags.';

        break;
      default:
        // No validation error
        break;
    }
  
    if (errorMessage) {
      throw new ValidationError(errorMessage, [
        new ValidationErrorItem(errorMessage, 'not_valid', 'password', password, user, 'not_valid'),
      ]);
    }
  
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
  });
  
  return user;
};
