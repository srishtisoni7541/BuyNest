const express = require('express');

const router = express.Router();
const verifyUser = require("../middleware/user.middleware");
const { addToCart, findAllCart, removeFromCart, updateCart } = require('../controllers/cart.controller');


router.post('/add-to-cart',verifyUser,addToCart);
router.get("/all",verifyUser,findAllCart);
router.delete('/remove/:productId',verifyUser,removeFromCart);
router.put('/update/:productId',verifyUser,updateCart);

module.exports = router;