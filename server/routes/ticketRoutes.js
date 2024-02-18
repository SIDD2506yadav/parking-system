const express = require("express");
const ticketController = require("../controllers/ticketController.js");
const router = express.Router();

router.post("/createTicket", (req, res) => {
  return ticketController.createTicket(req, res);
});

router.post("/closeTicket", (req, res) => {
  return ticketController.closeTicket(req, res);
});


router.get("/getAllTickets", (req, res) => {
  return ticketController.getAllTickets(req, res);
})

module.exports = router;