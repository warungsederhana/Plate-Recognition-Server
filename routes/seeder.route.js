const express = require("express");
const controller = require("../controllers/seeder.controller");
const router = express.Router();

router.get("/kendaraan", controller.kendaraanSeed);
router.get("/tagihan-pajak", controller.tagihanPajakSeed);
router.get("/negara-asal", controller.negaraSeed);
router.get("/merk", controller.merkSeed);
router.get("/jenis-kendaraan", controller.jenisSeed);
router.get("/type-kendaraan", controller.typeSeed);

module.exports = router;
