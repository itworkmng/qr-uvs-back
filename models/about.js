/* jshint indent: 1 */
module.exports = function (sequelize, DataTypes) {
  const About = sequelize.define(
    "about",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      tableName: "about",
      timestamps: true,
    }
  );
  return About;
};
