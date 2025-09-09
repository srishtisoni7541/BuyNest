const express = require('express');
const { FindAllUsers, DeleteUserById } = require('../controllers/customer.controller');
const router = express.Router();
const verifyAdmin = require('../middleware/admin.middleware');



router.get('/all-users',verifyAdmin,FindAllUsers);
router.delete('/delete-customer/:id',verifyAdmin,DeleteUserById);
module.exports = router;