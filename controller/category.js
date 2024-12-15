const asyncHandler = require("../middleware/asyncHandle");
const MyError = require("../utils/myError");
const paginate = require("../utils/paginate-sequelize");
exports.create = asyncHandler(async (req, res, next) => {
  await req.db.category.create(req.body);
  res.status(200).json({
    message: "",
    body: { success: true },
  });
});
exports.update = asyncHandler(async (req, res, next) => {
  await req.db.category.update(req.body, {
    where: {
      id: req.params.id,
    },
  });
  res.status(200).json({
    message: "",
    body: { success: true },
  });
});
exports.removeCategory = asyncHandler(async (req, res, next) => {
  let category = await req.db.category.findByPk(req.params.id);
  if (!category) {
    throw new MyError(`${req.params.id} дугаартай тэй ангилал олдсонгүй.`, 400);
  }
  await category.destroy();
  res.status(200).json({
    message: "",
    body: { success: true },
  });
});
exports.getCategories = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 1000;
  const sort = req.query.sort;
  let select = req.query.select;

  if (select) {
    select = select.split(" ");
  }

  ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);

  const pagination = await paginate(page, limit, req.db.category);

  let query = { offset: pagination.start - 1, limit };

  if (req.query) {
    query.where = req.query;
  }

  if (select) {
    query.attributes = select;
  }

  if (sort) {
    query.order = sort
      .split(" ")
      .map((el) => [
        el.charAt(0) === "-" ? el.substring(1) : el,
        el.charAt(0) === "-" ? "ASC" : "DESC",
      ]);
  }

  const category = await req.db.category.findAll({
    ...query,
  });
  const newCategory = await Promise.all(
    category.map(async (cat) => {
      const travels = await req.db.travel.findAll({
        where: {
          categoryId: cat.id,
        },
      });
      return { ...cat.toJSON(), travelCount: travels.length };
    })
  );

  res.status(200).json({
    message: "",
    body: { items: newCategory, total: newCategory.length, pagination },
  });
});
exports.topCategories = asyncHandler(async (req, res, next) => {
  const category = await req.db.category.findAll({
    limit: parseInt(req.query.limit) || 8,
    order: [["id", "DESC"]],
    where: {
      status: "top",
    },
  });

  res.status(200).json({
    message: "",
    body: { items: category, total: category.length },
  });
});
exports.getCategory = asyncHandler(async (req, res, next) => {
  let category = await req.db.category.findByPk(req.params.id);
  res.status(200).json({
    message: "",
    body: { category },
  });
});
exports.getCategoryInTravel = asyncHandler(async (req, res, next) => {
  console.log(req.params.id);
  let travel = await req.db.travel.findAll({
    where: { categoryId: req.params.id },
  });
  res.status(200).json({
    message: "",
    body: { items: travel },
  });
});
