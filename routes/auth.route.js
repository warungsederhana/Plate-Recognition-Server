const express = require("express");
const controller = require("../controllers/auth.controller");
const router = express.Router();

router.post("/signup", controller.signup);
router.post("/signin", controller.signin);
router.get("/verify-token", controller.verifyToken);

module.exports = router;
