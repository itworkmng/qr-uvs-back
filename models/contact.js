/* jshint indent: 1 */
module.exports = function (sequelize, DataTypes) {
    const Contact = sequelize.define(
      "contact",
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
      },
      {
        tableName: "contact",
        timestamps: true,
      }
    );
    return Contact;
  };
  