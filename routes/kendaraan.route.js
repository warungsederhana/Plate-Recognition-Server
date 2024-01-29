const express = require("express");
const controller = require("../controllers/kendaraan.controller");
const router = express.Router();

router.get("/", controller.getAllKendaraan);

module.exports = router;
