const express = require('express');
const router = express.Router();
const verifyAdmin = require('../middleware/admin.middleware');
const { CreateCategory, GetAllCategories, findById, updateById, DeleteById } = require('../controllers/category.controller');

router.post("/create",verifyAdmin,CreateCategory);
router.get('/allCategories',verifyAdmin,GetAllCategories)
router.get('/categorybyId/:id',verifyAdmin,findById);
router.patch('/update/:id',verifyAdmin,updateById);
router.delete('/delete/:id',verifyAdmin,DeleteById);

module.exports = router;