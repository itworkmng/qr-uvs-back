const asyncHandler = require("../middleware/asyncHandle");
const about_item = require("../models/about_item");
const MyError = require("../utils/myError");

exports.update = asyncHandler(async (req, res, next) => {
  let about = await req.db.about.findByPk(1);
  if (!about) {
    await req.db.about.create(req.body);
    await req.body.about_item.forEach(async (about_item) => {
      await req.db.about_item.create({ ...about_item });
    });
    res.status(200).json({
      message: "",
      body: about,
    });
  } else {
    let findcontent = await req.db.about_item.findAll();
    for (const about_item of findcontent) {
      await about_item.destroy();
    }
    await req.db.about.update(req.body, {
      where: {
        id: 1,
      },
    });
    await req.body.about_item.forEach(async (about_item) => {
      await req.db.about_item.create({ ...about_item });
    });
    res.status(200).json({
      message: "",
      body: about,
    });
  }
});

exports.getAbout = asyncHandler(async (req, res, next) => {
  let about = await req.db.about.findByPk(1);
  let about_item = await req.db.about_item.findAll();
  if (!about) {
    throw new MyError(`Мэдээлэл олдсонгүй`);
  }
  res.status(200).json({
    message: "",
    body: { id: about.id, title: about.title, about_item: about_item },
  });
});
