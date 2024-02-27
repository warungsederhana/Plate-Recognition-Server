const express = require("express");
const controller = require("../controllers/negaraAsal.controller");
const router = express.Router();

router.get("/", controller.getAllNegaraAsal);
router.post("/", controller.createNegaraAsal);
router.get("/:uid", controller.getNegaraAsalById);
router.put("/:uid", controller.updateNegaraAsal);
router.delete("/:uid", controller.deleteNegaraAsal);

module.exports = router;
