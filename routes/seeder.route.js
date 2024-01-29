const express = require("express");
const controller = require("../controllers/seeder.controller");
const router = express.Router();

router.get("/kendaraan", controller.kendaraanSeed);
router.get("/tagihan-pajak", controller.tagihanPajakSeed);

module.exports = router;
