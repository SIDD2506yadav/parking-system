const asde = require("../libraries/asde");
const ticketModel = require("../models/ticket.js");
const slotModelManager = require("./slotModelManager.js");
const { v4: uuidv4 } = require("uuid");

const createTicket = async (slotId, spaceId, vehicleMeta) => {
  const id = uuidv4();
  const ticket = { id, status: "open", entryAt: new Date(), slot: slotId, vehicleMeta, spaceId };
  const [error] = await asde(ticketModel.createTicket(ticket));

  if (error) {
    return {
      error: true,
      message: error.message || "Couldn't create a ticket, Some error occured",
      status: error.status || 500,
    };
  }

  return { ticket };
}

const closeTicket = async (ticketId, slotId) => {
  const { error: slotError, message: slotMessage, status: slotStatus } = await slotModelManager.releaseSlot(slotId);
  if (slotError) {
    return {
      error: true,
      message: slotMessage,
      status: slotStatus,
    };
  }
  const [error] = await asde(ticketModel.closeTicket(ticketId));
  if (error) {
    return {
      error: true,
      message: error.message || "Couldn't close ticket, Some error occured",
      status: error.status || 500,
    };
  }

  return { success: true };
}

const getAllTickets = async (spaceId, first) => {
  const [error, tickets = []] = await asde(ticketModel.getAllTickets(spaceId, first));
  if (error) {
    return {
      error: true,
      message: error.message || "Couldn't get tickets, Some error occured",
      status: error.status || 500,
    };
  }

  return { tickets };
}

module.exports = {
  createTicket,
  closeTicket,
  getAllTickets
}