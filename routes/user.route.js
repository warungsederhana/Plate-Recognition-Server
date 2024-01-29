const express = require("express");
const { isUserMiddleware } = require("../middlewares/auth.middleware");
const controller = require("../controllers/user.controller");
const router = express.Router();

router.get("/", controller.getAllUsers);
router.get("/profile", [isUserMiddleware], controller.getUserById);

module.exports = router;
