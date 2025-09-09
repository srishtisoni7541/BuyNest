require('dotenv').config({ path: '../.env' });
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
require('./config/db');
const passport = require('../auth-common/googleAuth');
const session = require("express-session");
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
require('../utils/Redis');
const userRouter = require('./routes/user.routes');
const orderRouter = require('./routes/order.routes');
const cartRouter = require('./routes/cart.routes');
const paymentRouter = require('./routes/payment.routes');
const likeRouter = require('./routes/like.routes');

app.use(helmet());

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173", 
  credentials: true, 
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(morgan('tiny'));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "yoursecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,       
      secure: process.env.NODE_ENV === "production", 
      sameSite: "strict",   
    }
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(
  "/payment/webhook",
  express.raw({ type: "application/json" })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use('/users',userRouter);

app.use('/orders',orderRouter);
app.use('/cart',cartRouter);
app.use('/payment',paymentRouter);
app.use('/products',likeRouter);


app.listen(3001, () => {
  console.log(' user panel running on http://localhost:3001');
});
