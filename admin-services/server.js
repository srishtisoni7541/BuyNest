require("dotenv").config({ path: "../.env" });
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
require("./config/db");
const passport = require("../auth-common/googleAuth");
const session = require("express-session");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
require("../utils/Redis");

app.use(helmet());

app.use(cors({
  origin: [process.env.FRONTEND_USER_URL || "http://localhost:5173", process.env.FRONTEND_ADMIN_URL || "http://localhost:5174"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));



app.use(morgan("tiny"));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "yoursecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const adminRouter = require("./routes/admin.routes");
const categoryRouter = require("./routes/categories.routes");
const ProductRouter = require("./routes/product.routes");
const orderRouter = require('./routes/order.routes');
const customerRouter = require('./routes/customer.routes');

app.use("/admin", adminRouter);
app.use("/category", categoryRouter);
app.use("/product", ProductRouter);
app.use('/orders',orderRouter);
app.use('/customers',customerRouter);

app.listen(3000, () => {
  console.log(" Admin panel running on http://localhost:3000");
});
