const express = require("express");
const controller = require("../controllers/merk.controller");
const router = express.Router();

router.get("/", controller.getAllMerk);
router.post("/", controller.createMerk);
router.get("/latest", controller.getLatestMerk);
router.get("/:uid", controller.getMerkById);
router.put("/:uid", controller.updateMerk);
router.delete("/:uid", controller.deleteMerk);

module.exports = router;
