const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 8080;
const dotenv = require("dotenv");
const morgan = require("morgan");
app.use(cors());
const connectDB = require("./config/db");

app.use(express.json());
app.use(
  express.json({
    extended: true,
  })
);
app.use(morgan("dev"));

// use dotenv files
dotenv.config({
  path: "./config/config.env",
});

// db
connectDB();

// ADD API ROUTES HERE
app.use("/api/auth", require("./routes/UserRoutes"));

app.listen(PORT, () => {
  console.log("Server running on PORT : " + PORT);
});
