/* jshint indent: 1 */
module.exports = function (sequelize, DataTypes) {
    const Content = sequelize.define(
      "content",
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        content: {
          type: DataTypes.JSON,
          allowNull: false,
        },
        image: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        travelId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "travel",
            key: "id",
          },
        },
      },
      {
        tableName: "content",
        timestamps: true,
      }
    );
    return Content;
  };
  