const express =  require('express');
const router = express.Router();
const verifyAdmin = require('../middleware/admin.middleware');
const { CreateProduct, FindAllProducts, FindById, updateById, DeleteById } = require('../controllers/product.controller');
const parser = require('../../utils/multer');

router.post('/create',verifyAdmin, parser.array("images", 5),CreateProduct);
router.get('/allProducts',FindAllProducts);
router.get('/:id',FindById);
router.post('/update/:id',verifyAdmin,parser.array("images", 5), updateById);
router.delete('/delete/:id',verifyAdmin,DeleteById);
module.exports = router;