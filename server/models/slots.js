const db = require("../libraries/db.js");
const slotsTable = "slots";

const getFreeSpace = (spaceId, type) => {
  return db(slotsTable)
    .select("*")
    .whereRaw(
      `spaceId = ${spaceId} and status = 'available' and type >= ${type}`
    )
    .orderBy("type")
    .limit(1);
};

const createSlot = (slot) => {
  const { id, floor, bayNumber, spaceId, status, type } = slot;
  return db(slotsTable)
    .insert({ id, floor, bayNumber, spaceId, status, type })
    .returning("*");
};

const releaseSlot = (slotId) => {
  return db(slotsTable).update({ status: "available" }).where({ id: slotId });
};

const fillFreeSlot = (spaceId, type) => { 
  return db(slotsTable).update({ status: "occupied" }).whereRaw(
    // `"spaceId" = '${spaceId}' and status = 'available' and type >= ${type}`
    `id IN (SELECT id
      FROM slots where "spaceId" = '${spaceId}' and type >= ${type} and status = 'available' ORDER BY type limit 1)`
  ).returning("*");
};

module.exports = {
  getFreeSpace,
  createSlot,
  releaseSlot,
  fillFreeSlot,
};
