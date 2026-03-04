const express = require('express');
const productController = require('../controllers/product.controllers');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();        
router.post("/registerProduct", productController.registerProduct);
router.put("/updateProduct/:id", productController.updateProduct);
router.get("/findProductById/:id", productController.findProductById);
router.get("/findProductByName/:name", productController.findProductByName);
router.get("/findProductsByCategory/:category_id", productController.findProductsByCategory);
router.get("/allProducts", productController.allProducts);  

module.exports = router;    



