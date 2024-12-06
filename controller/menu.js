const { query } = require("express");
const asyncHandler = require("../middleware/asyncHandle");
const MyError = require("../utils/myError");

exports.newMenu = asyncHandler(async (req, res, next) => {
  const { menu, is_active, categories } = req.body;
  if (!categories) {
    throw new MyError(`ангилал оруулаагүй хоосон байхгүй байна`, 400);
  } else if (!menu) {
    throw new MyError(`менью хоосон байна`, 400);
  }
  const newmenu = await req.db.menu.create({ name: menu, is_active });
  const MenuCategoryCollection = await Promise.all(
    categories?.map(async (categoryId) => {
      return await req.db.menu_category.create({
        menuId: newmenu.id,
        categoryId: categoryId,
      });
    })
  );

  res.status(200).json({
    message: "",
    body: { success: true, menu: MenuCategoryCollection },
  });
});
exports.getMenus = asyncHandler(async (req, res, next) => {
  const menus = await req.db.menu.findAll({});

  // Map and resolve promises for each menu
  const groupedMenus = await Promise.all(
    menus.map(async (menu) => {
      // Fetch associated menu_category records for each menu
      const menuCollection = await req.db.menu_category.findAll({
        where: {
          menuId: menu.id,
        },
        include: [
          {
            model: req.db.category,
            attributes: ["id", "name"],
          },
        ],
      });

      // Restructure data
      return {
        id: menu.id,
        name: menu.name,
        is_active: menu.is_active,
        categories: menuCollection.map((item) => ({
          id: item.category?.id || null,
          name: item.category?.name || null,
        })),
      };
    })
  );

  // Respond with grouped menus
  res.status(200).json({
    message: "",
    body: { items: groupedMenus, total: groupedMenus.length },
  });
});
exports.getActiveMenu = asyncHandler(async (req, res, next) => {
  const menus = await req.db.menu.findAll({where:{
    is_active:true
  }});

  // Map and resolve promises for each menu
  const groupedMenus = await Promise.all(
    menus.map(async (menu) => {
      // Fetch associated menu_category records for each menu
      const menuCollection = await req.db.menu_category.findAll({
        where: {
          menuId: menu.id,
        },
        include: [
          {
            model: req.db.category,
            attributes: ["id", "name"],
          },
        ],
      });

      // Restructure data
      return {
        id: menu.id,
        name: menu.name,
        is_active: menu.is_active,
        categories: menuCollection.map((item) => ({
          id: item.category?.id || null,
          name: item.category?.name || null,
        })),
      };
    })
  );

  // Respond with grouped menus
  res.status(200).json({
    message: "",
    body: { items: groupedMenus, total: groupedMenus.length },
  });
});
exports.getMenu = asyncHandler(async (req, res, next) => {
  // Fetch the menu by ID, including its related categories
  const menuWithCategories = await req.db.menu_category.findAll({
    include: [
      {
        model: req.db.menu,
        attributes: ["id", "name", "is_active"],
      },
      {
        model: req.db.category,
        attributes: ["id", "name"],
      },
    ],
    where: {
      menuId: req.params.id, // Replace with the desired menu ID
    },
  });

  // Throw error if menu not found
  if (!menuWithCategories.length) {
    throw new MyError(`Menu with ID ${req.params.id} not found`, 404);
  }

  // Restructure the result
  const result = menuWithCategories.reduce(
    (acc, current) => {
      // Add menu details only once
      if (!acc.menu) {
        acc.menu = {
          id: current.menu.id,
          name: current.menu.name,
          is_active: current.menu.is_active,
        };
      }

      // Collect categories
      acc.categories.push({
        id: current.category.id,
        name: current.category.name,
      });

      return acc;
    },
    { menu: null, categories: [] }
  );

  // Return the response
  return res.json({
    success: true,
    menu: {
      ...result.menu,
      categories: result.categories,
    },
  });
});
exports.removeMenu = asyncHandler(async (req, res, next) => {
  let menu = await req.db.menu.findByPk(req.params.id);
  if (!menu) {
    throw new MyError(`${req.params.id} дугаартай тэй ангилал олдсонгүй.`, 400);
  }
  await menu.destroy();
  res.status(200).json({
    message: "",
    body: { success: true },
  });
});
exports.updateMenu = asyncHandler(async (req, res, next) => {
  let findmenu = await req.db.menu.findByPk(req.params.id);
  if (!findmenu) {
    throw new MyError(`${req.params.id} дугаартай тэй ангилал олдсонгүй.`, 400);
  }

  await findmenu.destroy();

  const { menu, is_active, categories } = req.body;
  if (!categories) {
    throw new MyError(`ангилал оруулаагүй хоосон байхгүй байна`, 400);
  } else if (!menu) {
    throw new MyError(`менью хоосон байна`, 400);
  }
  const newmenu = await req.db.menu.create({ name: menu, is_active });
  const MenuCategoryCollection = await Promise.all(
    categories?.map(async (categoryId) => {
      return await req.db.menu_category.create({
        menuId: newmenu.id,
        categoryId: categoryId,
      });
    })
  );

  res.status(200).json({
    message: "",
    body: { success: true, menu: MenuCategoryCollection },
  });
});
