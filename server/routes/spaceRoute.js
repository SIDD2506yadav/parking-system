const express = require("express");
const spaceController = require("../controllers/spaceController.js");
const router = express.Router();

router.get("/getSpace", (req, res) => {
  return spaceController.getSpace(req, res);
});

router.post("/createSpace", (req, res) => {
  return spaceController.createSpace(req, res);
});

module.exports = router;