/* jshint indent: 1 */
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
module.exports = function (sequelize, DataTypes) {
  const Message = sequelize.define(
    "messages",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Та нэрээ оруулна уу",
          },
          len: {
            args: [3, 100],
            msg: "Таны нэр хэт богино байна",
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: {
            msg: "И-мэйл буруу байна",
          },
        },
      },
      phone_number: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Та дугаараа оруулна уу",
          },
          len: {
            args: [8, 9],
            msg: "Таны дугаар буруу байна",
          },
        },
      },
      label: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      tableName: "messages",
      timestamps: true,
    }
  );
  return Message;
};
