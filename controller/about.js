const asyncHandler = require("../middleware/asyncHandle");
const MyError = require("../utils/myError");

exports.update = asyncHandler(async (req, res, next) => {
    let about = await req.db.about.findByPk(1);
  if (!about) {
    await req.db.about.create(req.body);
    res.status(200).json({
      about: "",
        body: about,
      });
  }
  else{
    await req.db.about.update(req.body, {
        where: {
          id: 1,
        },
      });
      res.status(200).json({
        message: "",
        body:  about,
      });
  }
});

exports.getAbout = asyncHandler(async (req, res, next) => {
  let about = await req.db.about.findByPk(1);
  if (!about) {
    throw new MyError(`Мэдээлэл олдсонгүй`);
  }
  res.status(200).json({
    message: "",
    body: about,
  });
});
