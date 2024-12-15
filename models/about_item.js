/* jshint indent: 1 */
module.exports = function (sequelize, DataTypes) {
    const AboutItem = sequelize.define(
      "about_item",
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        content: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        thumbnail: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
      },
      {
        tableName: "about_item",
        timestamps: true,
      }
    );
    return AboutItem;
  };
  