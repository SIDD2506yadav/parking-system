const express = require("express");
const slotController = require("../controllers/slotController.js");
const router = express.Router();

router.post("/createSlot", (req, res) => {
  return slotController.createSlot(req, res);
});

router.post("/fillSlot", (req, res) => {
  return slotController.fillSlot(req, res);
});

router.post("/releaseSlot", (req, res) => {
  return slotController.releaseSlot(req, res);
});

module.exports = router;