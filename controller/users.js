const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const asyncHandler = require("../middleware/asyncHandle");
const MyError = require("../utils/myError");
const sendEmail = require("../utils/email");
const { generateLengthPass } = require("../utils/functions");


exports.updateUser = asyncHandler(async (req, res, next) => {
  await req.db.users.update(req.body, {
    where: {
      id: req.params.id,
    },
  });
  res.status(200).json({
    message: "",
    body: { success: true },
  });
});

exports.removeUser = asyncHandler(async (req, res, next) => {
  const userId = req.params.id;
  const user = await req.db.users.findByPk(userId);
  await user.destroy();

  res.status(200).json({
    message: "",
    body: { success: true },
  });
});

exports.getUsers = asyncHandler(async (req, res, next) => {
  const sort = req.query.sort;
  let select = req.query.select;

  if (select) {
    select = select.split(" ");
  }

  ["select", "sort"].forEach((el) => delete req.query[el]);

  let query = {};

  if (req.query) {
    query.where = { ...req.query, role: { [Op.ne]: "superman" } };
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

  const users = await req.db.users.findAll(query);
  res.status(200).json({
    message: "",
    body: { items: users, total: users.length },
  });
});

exports.signin = asyncHandler(async (req, res, next) => {
  const { phone, password } = req.body;
  if (!phone || !password) {
    throw new MyError("Утас эсвэл нууц үгээ оруулна уу", 400);
  }
  const user = await req.db.users.findOne({
    where: { phone_number: phone},
  });
  if (!user) {
    throw new MyError("Мэдээлэл буруу байна", 400);
  }

  const ok = await user.CheckPass(password);
  if (!ok) {
    throw new MyError("Мэдээлэл буруу байна", 400);
  }
  res.status(200).json({
    message: "",
    body: { token: user.getJsonWebToken(), user: user },
  });
});
exports.signup = asyncHandler(async (req, res) => {
  const user = await req.db.users.create({ ...req.body });
  if (!user) {
    throw new MyError("Бүртгэж чадсангүй");
  }

  // const message = `<b>Сайн байна уу?</b><br>
  // Та “Хэвлэмэл хуудасны захиалга, хяналтын систем”-д дараах эрхээр нэвтрэн орж хэвлэмэл хуудасны захиалгаа өгнө үү.<br>
  // Холбоос: <a href="www.eblank.mn">www.eblank.mn</a><br>
  // Нэвтрэх нэр: <b>${user.phone_number}</b><br>
  // Нууц үг: <b>${password}</b><br>
  // Өдрийг сайхан өнгөрүүлээрэй!<br>
  // <a href="www.itwork.mn">www.itwork.mn</a> ©${new Date().getFullYear()} БҮХ ЭРХ ХУУЛИАР ХАМГААЛАГДСАН.`;

  // await sendEmail({
  //   subject: "Нууц үг солигдлоо",
  //   email: req.body.email,
  //   message,
  // });

  res.status(200).json({
    message: "",
    body: { token: user.getJsonWebToken(), user: user },
  });
});
exports.getInfo = asyncHandler(async (req, res, next) => {
  const info = await req.db.users.findByPk(req.id);
  if (!req.id || !info) {
    throw new MyError("Мэдээлэл олдсонгүй", 404);
  }

  res.status(200).json({
    message: "",
    body: info,
  });
});
exports.change_password = asyncHandler(async (req, res, next) => {
  const userId = req.params.id;
  if (!userId) {
    throw new MyError("хэрэглэгч олдсонгүй!", 400);
  }
  const salt = await bcrypt.genSalt(10);
  const new_password = generateLengthPass(6);
  const password = await bcrypt.hash(new_password, salt);
  await req.db.users.update(
    { password: password },
    {
      where: {
        id: userId,
      },
    }
  );

  const find_users = await req.db.users.findByPk(userId);
  if (!find_users) {
    throw new MyError("Мэдээлэл олдсонгүй", 404);
  }
  const message = `<b>Сайн байна уу?</b><br>
  Та “Хэвлэмэл хуудасны захиалга, хяналтын систем”-д дараах эрхээр нэвтрэн орж хэвлэмэл хуудасны захиалгаа өгнө үү.<br>
  Холбоос: <a href="www.eblank.mn">www.eblank.mn</a><br>
  Нэвтрэх нэр: <b>${find_users.phone_number}</b><br>
  Нууц үг: <b>${new_password}</b><br>
  Өдрийг сайхан өнгөрүүлээрэй!<br>
  <a href="www.itwork.mn">www.itwork.mn</a> ©${new Date().getFullYear()} БҮХ ЭРХ ХУУЛИАР ХАМГААЛАГДСАН.`;
  await sendEmail({
    subject: "Нууц үг солигдлоо",
    email: find_users.email,
    message,
  });

  res.status(200).json({
    message: "",
    body: { success: true },
  });
});
exports.change_password_client = asyncHandler(async (req, res, next) => {
  const clientId = req.params.id;
  if (!clientId) {
    throw new MyError("хэрэглэгч олдсонгүй!", 400);
  }
  const salt = await bcrypt.genSalt(10);
  const new_password = generateLengthPass(6);
  const password = await bcrypt.hash(new_password, salt);
  await req.db.clients.update(
    { password: password },
    {
      where: {
        id: clientId,
        userId: req.id,
      },
    }
  );

  const find_users = await req.db.clients.findByPk(clientId);
  const message = `<b>Сайн байна уу?</b><br>
  Та “Хэвлэмэл хуудасны захиалга, хяналтын систем”-д дараах эрхээр нэвтрэн орж хэвлэмэл хуудасны захиалгаа өгнө үү.<br>
  Компаний нэр: <b>${find_users.company_name}</b><br>
  Холбоос: <a href="www.eblank.mn">www.eblank.mn</a><br>
  Нэвтрэх нэр: <b>${find_users.phone_number}</b><br>
  Нууц үг: <b>${new_password}</b><br>
  Өдрийг сайхан өнгөрүүлээрэй!<br>
  <a href="www.itwork.mn">www.itwork.mn</a> ©${new Date().getFullYear()} БҮХ ЭРХ ХУУЛИАР ХАМГААЛАГДСАН.`;
  await sendEmail({
    subject: "Нууц үг солигдлоо",
    email: find_users.email,
    message,
  });

  res.status(200).json({
    message: "",
    body: { success: true },
  });
});

exports.forgot_password = asyncHandler(async (req, res, next) => {
  const email = req.body.email;
  if (!email) {
    throw new MyError("Хэрэглэгч олдсонгүй!", 400);
  }
  const users = await req.db.users.findOne({
    where: {
      email,
    },
  });
  if (!users) {
    throw new MyError("хэрэглэгч олдсонгүй!", 400);
  }
  const salt = await bcrypt.genSalt(10);
  const new_password = generateLengthPass(6);
  const password = await bcrypt.hash(new_password, salt);
  await req.db.users.update(
    { password },
    {
      where: {
        email,
      },
    }
  );

  const find_users = await req.db.users.findByPk(users.id);
  if (!find_users) {
    throw new MyError("Мэдээлэл олдсонгүй", 404);
  }
  const message = `<b>Сайн байна уу?</b><br>
  Та “Хэвлэмэл хуудасны захиалга, хяналтын систем”-д дараах эрхээр нэвтрэн орж хэвлэмэл хуудасны захиалгаа өгнө үү.<br>
  Холбоос: <a href="www.eblank.mn">www.eblank.mn</a><br>
  Нэвтрэх нэр: <b>${find_users.phone_number}</b><br>
  Нууц үг: <b>${new_password}</b><br>
  Өдрийг сайхан өнгөрүүлээрэй!<br>
  <a href="www.itwork.mn">www.itwork.mn</a> ©${new Date().getFullYear()} БҮХ ЭРХ ХУУЛИАР ХАМГААЛАГДСАН.`;
  await sendEmail({
    subject: "Нууц үг солигдлоо",
    email: find_users.email,
    message,
  });

  res.status(200).json({
    message: "",
    body: { success: true },
  });
});
