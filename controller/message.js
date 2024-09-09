const asyncHandler = require("../middleware/asyncHandle");

const paginate = require("../utils/paginate-sequelize");
exports.create = asyncHandler(async (req, res, next) => {
  await req.db.messages.create(req.body);
  res.status(200).json({
    message: "",
    body: { success: true },
  });
});
exports.getAllMessage = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sort = req.query.sort;
  let select = req.query.select;

  if (select) {
    select = select.split(" ");
  }

  ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);

  const pagination = await paginate(page, limit, req.db.messages);

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

  const message = await req.db.messages.findAll(query);

  res.status(200).json({
    message: "",
    body: { items: message, total: message.length, pagination },
  });
});

exports.removeMessage = asyncHandler(async (req, res, next) => {
  let message = await req.db.messages.findByPk(req.params.id);
  if (!message) {
    throw new MyError(`${req.params.id} дугаартай тэй ангилал олдсонгүй.`, 400);
  }
  await message.destroy();
  res.status(200).json({
    message: "",
    body: { success: true },
  });
});
