const express = require("express");
const controller = require("../controllers/seeder.controller");
const router = express.Router();

router.get("/kendaraan", controller.kendaraanSeed);

module.exports = router;
