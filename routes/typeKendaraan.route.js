const express = require("express");
const controller = require("../controllers/typeKendaraan.controller");
const router = express.Router();

router.get("/", controller.getAllTypeKendaraan);
router.post("/", controller.createTypeKendaraan);
router.get("/:uid", controller.getTypeKendaraanById);
router.put("/:uid", controller.updateTypeKendaraan);
router.delete("/:uid", controller.deleteTypeKendaraan);

module.exports = router;
