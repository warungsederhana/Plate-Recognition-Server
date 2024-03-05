const express = require("express");
const controller = require("../controllers/kendaraan.controller");
const router = express.Router();

router.get("/", controller.getAllKendaraan);
router.post("/", controller.createKendaraan);
router.get("/latest", controller.getLatestKendaraan);
router.get("/:uid", controller.getKendaraanById);
router.put("/:uid", controller.updateKendaraan);
router.delete("/:uid", controller.deleteKendaraan);

module.exports = router;
