const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 8080;
require("dotenv").config();
app.use(cors());
app.use(express.json());

// ADD API ROUTES HERE

app.listen(PORT, () => {
  console.log("Server running on PORT : " + PORT);
});
