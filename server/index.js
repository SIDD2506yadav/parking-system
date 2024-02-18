const express = require("express");
const app = express();
const cors = require('cors');

const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

const slotRoutes = require("./routes/slotRoutes.js");
const spaceRoutes = require("./routes/spaceRoute.js");
const ticketRoutes = require("./routes/ticketRoutes.js");

app.use("/space", spaceRoutes);
app.use("/slot", slotRoutes);
app.use("/ticket", ticketRoutes);

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});