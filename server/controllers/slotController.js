const slotModelManager = require("../modelmanagers/slotModelManager.js");

const createSlot = async (req, res) => {
  const { floor, bayNumber, spaceId, type } = req.body;
  if (!floor || !bayNumber || !spaceId || !spaceId.trim() || !type) {
    return res.status(400).send({ success: false, message: "Required fields missing." });
  }

  const { error, message, status, slot } = await slotModelManager.createSlot({ floor, bayNumber, spaceId, type });
  if (error) {
    return res.status(status).send({ success: false, message });
  }

  return res.status(200).send({ success: true, slot });
}

const releaseSlot = async (req, res) => {
  const { id } = req.body;
  if (!id || !id.trim()) {
    return res.status(400).send({ success: false, message: "Slot id is missing." })
  }

  const { error, message, status } = await slotModelManager.releaseSlot(id);
  if (error) {
    return res.status(status).send({ success: false, message });
  }

  return res.status(200).send({ success: true });
}

const fillSlot = async (req, res) => {
  const { spaceId, type } = req.body;
  if (!spaceId || !spaceId.trim() || !type) {
    return res.status(400).send({ success: false, message: "Parking space id or vehicle type is missing." })
  }

  const { error, message, status, slot } = await slotModelManager.fillFreeSlot(spaceId, type);
  if (error) {
    return res.status(status).send({ success: false, message });
  }

  if (!slot) {
    return res.status(404).send({ success: false, message: "No free slot found" });
  }

  return res.status(200).send({ success: true, slot });
}

module.exports = {
  createSlot,
  // createFloor,
  releaseSlot,
  fillSlot
};
