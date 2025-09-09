const express = require('express');
const  router = express.Router();
const verifyAdmin = require('../middleware/admin.middleware');
const { getAllOrders, updateOrderStatus } = require('../controllers/order.controller');


router.get('/all-orders',verifyAdmin,getAllOrders);
router.put('/update-status',verifyAdmin,updateOrderStatus);

module.exports = router;