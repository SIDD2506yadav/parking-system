const spaceModelManager = require("../modelmanagers/spaceModelManager.js");

const getSpace = async (req, res) => {
  const { id } = req.query;
  if (!id) {
    return res
      .status(400)
      .send({ success: false, message: "Space id missing" });
  }

  const { space, error, message, status } = await spaceModelManager.getSpace(
    id
  );
  if (error) {
    return res.status(status).send({ success: false, message });
  }

  if (!space) {
    return res
      .status(404)
      .send({
        success: false,
        message: "No parking space found for current space id",
      });
  }

  return res.status(200).send({ success: true, space });
};

const createSpace = async (req, res) => {
  const { title, address, meta = {}, slotData } = req.body;

  if (
    !title ||
    !title.trim() ||
    !address ||
    !address.trim() ||
    !Array.isArray(slotData) ||
    slotData.length === 0
  ) {
    return res
      .status(400)
      .send({ success: false, message: "Title, address or floor data fields missing fields" });
  }

  const { space, error, message, status } = await spaceModelManager.createSpace(
    { title, address, meta, slotData }
  );

  if (error) {
    return res.status(status).send({ success: false, message });
  }

  return res.status(200).send({ success: true, space });
};

module.exports = {
  getSpace,
  createSpace,
};
