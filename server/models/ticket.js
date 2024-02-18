const db = require("../libraries/db.js");
const ticketsTable = "tickets";

const createTicket = (ticket) => {
  const { id, status, entryAt, slot, vehicleMeta, spaceId } = ticket;
  return db(ticketsTable).insert({ id, status, entryAt, vehicleMeta, slot, spaceId }).returning("*");
};

const closeTicket = (ticketId) => {
  return db(ticketsTable).update({ status: "closed", exitAt: new Date() }).where({ id: ticketId });
}

const getAllTickets = (spaceId, first) => {
  return db(ticketsTable).select("*").where({ spaceId }).offset(first).limit(10).orderBy("entryAt", "desc");
}

module.exports = {
  createTicket,
  closeTicket,
  getAllTickets
}