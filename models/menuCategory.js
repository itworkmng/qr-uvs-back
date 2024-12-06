module.exports = function (sequelize, DataTypes) {
  const MenuCategory = sequelize.define(
    "menu_category",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      menuId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "menu",
          key: "id",
        },
      },
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "menu_category",
      timestamps: false,
    }
  );
  return MenuCategory;
};
