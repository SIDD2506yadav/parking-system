const { v4: uuidv4 } = require("uuid");
const asde = require("../libraries/asde");
const slotModel = require("../models/slots.js");

const getFreeSlot = async (spaceId, type) => {
  const [error, [slot] = []] = await asde(slotModel.getFreeSpace(spaceId, type));

  if (error) {
    return {
      error: true,
      message: error.message || "Unable to get available slot, Some error occured",
      status: error.status || 500,
    };
  }

  return { slot };
}

const createSlot = async ({ floor, bayNumber, spaceId, type }) => {
  const id = uuidv4();
  const slot = { floor, bayNumber, spaceId, type, id, status: "available" };
  const [error] = await asde(slotModel.createSlot(slot));

  if (error) {
    return {
      error: true,
      message: error.message || "Couldn't create a slot, Some error occured",
      status: error.status || 500,
    };
  }

  return { slot };
};

const createFloorSots = async ({ floorSlots, floor, spaceId }) => {
  let bayNumberCount = 1;
  for (let slots of floorSlots) {
    const { type, count } = slots;
    for (let slotCount = 0; slotCount < count; slotCount++) {
      await createSlot({ floor, bayNumber: bayNumberCount, spaceId, type });
      bayNumberCount++;
    }
  }
};

const createFloor = async ({ floorData, spaceId }) => {
  for (let { floor, floorSlots } of floorData) {
    await createFloorSots({ floor, floorSlots, spaceId });
  }
};

const releaseSlot = async (slotId) => {
  const [error] = await asde(slotModel.releaseSlot(slotId));
  if (error) {
    return {
      error: true,
      message: "Couldn't release slot, Some error occured",
      status: error.status,
    };
  }

  return { success: true };
};

const fillFreeSlot = async (spaceId, type) => {
  const [error, [slot] = []] = await asde(slotModel.fillFreeSlot(spaceId, type));
  if (error) {
    return {
      error: true,
      message: error.message || "Couldn't fill slot, Some error occured",
      status: error.status || 500,
    };
  }

  return { slot };
};

module.exports = {
  getFreeSlot,
  createSlot,
  createFloor,
  releaseSlot,
  fillFreeSlot,
};
