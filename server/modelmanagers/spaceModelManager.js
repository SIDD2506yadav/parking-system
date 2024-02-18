const asde = require("../libraries/asde.js");
const spaceModel = require("../models/space.js");
const slotModelManager = require("./slotModelManager.js");
const { v4: uuidv4 } = require("uuid");

const getSpace = async (id) => {
  const [error, [space] = []] = await asde(spaceModel.getSpace(id));
  console.log(space)
  if (error) {
    return {
      error: true,
      message: error.message || "Some error occured",
      status: error.status || 500,
    };
  }
  return { space };
};

const createSpace = async ({ title, address, meta, slotData }) => {
  const id = uuidv4();
  const [error, [space] = []] = await asde(spaceModel.createSpace({ id, title, address, meta }));
  if (error) {
    return {
      error: true,
      message: error.message || "Some error occured",
      status: error.status || 500,
    }; 
  }

  if (space) {
    await slotModelManager.createFloor({ floorData: slotData, spaceId: space.id });
  }

  return { space };
};

module.exports = {
  getSpace,
  createSpace,
};
