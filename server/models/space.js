const db = require("../libraries/db.js");
const parkingSpacesTable = "space";

const getSpace = (id) => {
  return db(parkingSpacesTable).select("*").where({ id });
};

const createSpace = (space) => {
  const { id, title, address, meta = {} } = space;
  return db(parkingSpacesTable)
    .insert({ id, title, address, meta })
    .returning("*");
};

module.exports = {
  getSpace,
  createSpace,
};
