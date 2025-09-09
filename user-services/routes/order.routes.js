const express = require('express');
const { createOrder, getAllOrders, getOrderById, cancelOrder, updateUserOrder } = require('../controllers/order.controller');
const verifyUser = require('../middleware/user.middleware');

const router = express.Router();

router.post('/create',verifyUser,createOrder);
router.get('/all-orders',verifyUser,getAllOrders);
router.get('/getOne/:id',verifyUser,getOrderById);
router.post('/update-order/:id',verifyUser,updateUserOrder)
router.post('/cancel-order/:id',verifyUser,cancelOrder);

module.exports = router;