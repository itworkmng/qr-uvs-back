module.exports = function (sequelize, DataTypes) {
  const Menu = sequelize.define(
    "menu",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      tableName: "menu",
      timestamps: true,
    }
  );
  return Menu;
};
