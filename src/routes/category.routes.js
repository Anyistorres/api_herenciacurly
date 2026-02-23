const express = require("express");
const categoryController = require("../controllers/category.controllers");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/resgisterCategory", categoryController.registerCategory);
router.get("/allCategories", categoryController.allCategories);
router.put("/updateCategory", categoryController.updateCategory);
router.get("/findCategoryById/:id", categoryController.findCategoryById);   

module.exports = router;
