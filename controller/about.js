const asyncHandler = require("../middleware/asyncHandle");

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
    throw new MyError(`${req.params.id} id тэй мэдээлэл олдсонгүй`);
  }
  res.status(200).json({
    message: "",
    body: about,
  });
});
