const asyncHandler = require("../middleware/asyncHandle");
const MyError = require("../utils/myError");
const paginate = require("../utils/paginate-sequelize");
exports.create = asyncHandler(async (req, res, next) => {
  await req.db.travel.create(req.body);
  res.status(200).json({
    message: "",
    body: { success: true },
  });
});
exports.update = asyncHandler(async (req, res, next) => {
  await req.db.travel.update(req.body, {
    where: {
      id: req.params.id,
    },
  });
  res.status(200).json({
    message: "",
    body: { success: true },
  });
});
exports.removeTravel = asyncHandler(async (req, res, next) => {
  let travel = await req.db.travel.findByPk(req.params.id);
  if (!travel) {
    throw new MyError(`${req.params.id} дугаартай тэй ангилал олдсонгүй.`, 400);
  }
  await travel.destroy();
  res.status(200).json({
    message: "",
    body: { success: true },
  });
});
exports.getTravels = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sort = req.query.sort;
  const find = req.query.find;
  let select = req.query.select;

  if (select) {
    select = select.split(" ");
  }

  ["select", "sort", "page", "limit", "find"].forEach(
    (el) => delete req.query[el]
  );

  const pagination = await paginate(page, limit, req.db.travel);

  let query = { offset: pagination.start - 1, limit, find };

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

  const travel = await req.db.travel.findAll(query);

  res.status(200).json({
    message: "",
    body: { items: travel, total: travel.length, pagination },
  });
});
exports.getTravel = asyncHandler(async (req, res, next) => {
  let travel = await req.db.travel.findByPk(req.params.id);
  if (!travel) {
    throw new MyError(`${req.params.id} id тэй аялалын мэдээлэл олдсонгүй`);
  }
  res.status(200).json({
    message: "",
    body: { travel, category: await travel.getCategory() },
  });
});
