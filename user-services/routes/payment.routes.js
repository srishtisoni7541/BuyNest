const express = require("express");
const { createRazorpayOrder, verifyRazorpayPayment } = require("../controllers/payment.controller");
const router = express.Router();


router.post("/create-order", createRazorpayOrder);

router.post("/rzp/verify", verifyRazorpayPayment);


module.exports = router;
