const express = require("express");
const dotenv = require("dotenv");
var path = require("path");
var rfs = require("rotating-file-stream");
require("colors");
const errorHandler = require("./middleware/error");
var morgan = require("morgan");
const logger = require("./middleware/logger");
const fileupload = require("express-fileupload");

const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");

// Router оруулж ирэх
const usersRoutes = require("./routes/users");
const successRoutes = require("./routes/success");
const categoryRoutes = require("./routes/category");
const messageRoutes = require("./routes/message");
const travelRoutes = require("./routes/travel");
const aboutRoutes= require("./routes/about")
const menuRoutes = require("./routes/menu")
const injectDb = require("./middleware/injectDb");

// Аппын тохиргоог process.env рүү ачаалах
dotenv.config({ path: "./config/config.env" });

const db = require("./config/db-mysql");

const app = express();

// Express rate limit : Дуудалтын тоог хязгаарлана
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 500, // limit each IP to 100 requests per windowMs
  message: "5 минутанд 3 удаа л хандаж болно! ",
});

app.use(limiter);
// http parameter pollution халдлагын эсрэг books?name=aaa&name=bbb  ---> name="bbb"
app.use(hpp());
// Cookie байвал req.cookie рүү оруулж өгнө0
app.use(cookieParser());
// Бидний бичсэн логгер

app.use(logger);
// Body дахь өгөгдлийг Json болгож өгнө
app.use(express.json());
// Өөр өөр домэйнтэй вэб аппуудад хандах боломж өгнө
app.use(cors());
// Клиент вэб аппуудыг мөрдөх ёстой нууцлал хамгаалалтыг http header ашиглан зааж өгнө
app.use(helmet());
// клиент сайтаас ирэх Cross site scripting халдлагаас хамгаална
app.use(xss());
// Сэрвэр рүү upload хийсэн файлтай ажиллана
app.use(fileupload());
// req.db рүү mysql db болон sequelize моделиудыг оруулна
app.use(injectDb(db));

// create a write stream (in append mode)
// var accessLogStream = rfs.createStream("access.log", {
//   interval: "1d", // rotate daily
//   path: path.join(__dirname, "log"),
// });

// app.use(morgan("combined", { stream: accessLogStream }));
app.use("/api/v1", successRoutes);
app.use("/api/v1/user", usersRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/travel", travelRoutes);
app.use("/api/v1/msg", messageRoutes);
app.use("/api/v1/about", aboutRoutes);
app.use("/api/v1/menu", menuRoutes);
app.use(express.static("public"));
app.use(errorHandler);
// db.category.hasMany(db.travel, { onDelete: "CASCADE", hooks: true });
// db.travel.belongsTo(db.category);

db.category.hasMany(db.travel, { foreignKey: "categoryId" });
db.travel.belongsTo(db.category, { foreignKey: "categoryId" });


db.travel.hasMany(db.content, { foreignKey: "travelId",onDelete: "CASCADE", hooks: true  });
db.content.belongsTo(db.travel, { foreignKey: "travelId" });

db.menu.hasMany(db.menu_category, { foreignKey: "menuId",onDelete: "CASCADE", hooks: true });
db.menu_category.belongsTo(db.menu, { foreignKey: "menuId" });

// MenuCategory and Category association
db.menu_category.belongsTo(db.category, { foreignKey: "categoryId",onDelete: "CASCADE", hooks: false });
db.category.hasMany(db.menu_category, { foreignKey: "categoryId" });

db.sequelize
  .sync()
  .then((result) => {
    console.log("sync hiigdlee...");
  })
  .catch((err) => console.log(err));

const server = app.listen(
  process.env.PORT,
  console.log(`Express сэрвэр ${process.env.PORT} порт дээр аслаа... `.rainbow)
);

process.on("unhandledRejection", (err, promise) => {
  console.log(`Алдаа гарлаа : ${err.message}`.underline.yellow.bold);
  server.close(() => {
    process.exit(1);
  });
});
