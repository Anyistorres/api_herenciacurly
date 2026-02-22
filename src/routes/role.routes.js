const express = require("express");
const roleController = require("../controllers/role.controllers");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/listarRoles", roleController.listarRoles);

module.exports = router;
