const express = require("express");
const controller = require("../controllers/jenisKendaraan.controller");
const router = express.Router();

router.get("/", controller.getAllJenisKendaraan);
router.post("/", controller.createJenisKendaraan);
router.get("/latest", controller.getLatestJenisKendaraan);
router.get("/:uid", controller.getJenisKendaraanById);
router.put("/:uid", controller.updateJenisKendaraan);
router.delete("/:uid", controller.deleteJenisKendaraan);

module.exports = router;
