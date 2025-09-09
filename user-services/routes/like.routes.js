const express = require('express');
const router = express.Router();
const verifyUser = require('../middleware/user.middleware');
const { LikedProduct, fetchAllLikedProducts, removeLikedProducts } = require('../controllers/like.controller');



router.post('/like/:productId',verifyUser,LikedProduct);
router.get('/like/all',verifyUser,fetchAllLikedProducts);
router.delete('/like/delete/:productId',verifyUser,removeLikedProducts);

module.exports = router;