const express = require("express");
const cors = require("cors");
const app = express();
const jwt = require("express-jwt");
const jwks = require("jwks-rsa");
const axios = require("axios");
const jwtAuthz = require("express-jwt-authz");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const multer = require("multer");
const MessageModel = require("./models/MessageModel");
const FileModel = require("./models/FileModel");
const PORT = process.env.PORT || 8080;
require("dotenv").config();
app.use(cors());
app.use(express.json());

const fileFilter = (req, res, cb) => {
  cb(null, true);
};
const upload = multer({
  fileFilter: fileFilter,
});

// ADD API ROUTES HERE

const verifyToken = jwt.expressjwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: "https://ssd-project-v1.us.auth0.com/.well-known/jwks.json",
  }),
  audience: "ssd-api",
  issuer: "https://ssd-project-v1.us.auth0.com/",
  algorithms: ["RS256"],
});

const checkPermissionsWorker = jwtAuthz(["read:workers"], {
  customScopeKey: "permissions",
  customUserKey: "auth",
});

const checkPermissionsManager = jwtAuthz(["read:managers"], {
  customScopeKey: "permissions",
  customUserKey: "auth",
});

app.use(verifyToken);

app.get("/", (req, res) => {
  res.send("Hello World from index route");
});

app.get("/protected", async (req, res) => {
  console.log(req.auth);
  const accessToken = req.headers.authorization.split(" ")[1];
  const userInfo = await axios.get(
    "https://ssd-project-v1.us.auth0.com/userinfo",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  // res.send(userInfo.data);
  console.log(userInfo.data);
  res.send("Hello World from protected route");
});

app.post("/worker-validate", checkPermissionsWorker, async (req, res) => {
  if (!req.auth.permissions.includes("read:workers")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { message, email } = req.body;

  const hashedMessage = await bcrypt.hash(message, 10);

  // save new message
  const newMessage = new MessageModel({
    email,
    text: hashedMessage,
  });

  try {
    await newMessage.save();
    res.status(200).json({ message: "Message stored successfully" });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
});

app.post(
  "/manager-validate",
  checkPermissionsManager,
  upload.single("file"),
  async (req, res) => {
    if (!req.auth.permissions.includes("read:managers")) {
      console.log(req.auth);
      return res.status(401).json({ message: "Unauthorized" });
    }

    console.log(req.file);

    const { email } = req.body;

    // save new message
    const newFile = new FileModel({
      email,
      file: req.file.buffer,
    });

    try {
      await newFile.save();
      res.status(200).json({ message: "Message stored successfully" });
    } catch (error) {
      res.status(409).json({ message: error.message });
    }
  }
);

mongoose.connect(process.env.MONGO_URL, (error) => {
  if (error) throw error;
});

mongoose.connection.on("connected", () =>
  console.log("Connected to MongoCluster")
);
mongoose.connection.on("error", () =>
  console.log("MongoDB Connection Unsuccessfull")
);

app.listen(PORT, () => {
  console.log("Server running on PORT : " + PORT);
});
