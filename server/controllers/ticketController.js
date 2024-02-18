const ticketModelManager = require("../modelmanagers/ticketModelManager");

const createTicket = async (req, res) => {
  const { slotId, vehicleMeta, spaceId } = req.body;
  if (!slotId || !slotId.trim() || !spaceId || !spaceId.trim() || !vehicleMeta) {
    return res.status(400).send({ success: false, message: "Slot id or vehicle details missing for generating ticket." })
  }

  const { error, message, status, ticket } = await ticketModelManager.createTicket(slotId, spaceId, vehicleMeta);
  if (error) {
    return res.status(status).send({ success: false, message });
  }

  return res.status(200).send({ success: true, ticket });

}

const closeTicket = async (req, res) => {
  const { id, slotId } = req.body;
  if (!id || !id.trim() || !slotId || !slotId.trim()) {
    return res.status(400).send({ success: false, message: "Ticket id or slot id is missing." })
  }

  const { error, message, status } = await ticketModelManager.closeTicket(id, slotId);
  if (error) {
    return res.status(status).send({ success: false, message });
  }

  return res.status(200).send({ success: true });

}

const getAllTickets = async (req, res) => {
  const { spaceId, first, last } = req.query;
  if (!spaceId || !first) {
    return res.status(400).send({ success: false, message: "Space id or pagination param missing." })
  }

  const { error, message, status, tickets } = await ticketModelManager.getAllTickets(spaceId, first);

  if (error) {
    return res.status(status).send({ success: false, message });
  }

  return res.status(200).send({ success: true, tickets });
}

module.exports = {
  createTicket,
  getAllTickets,
  closeTicket
}