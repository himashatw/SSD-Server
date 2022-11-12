const express = require("express");
const cors = require("cors");
const app = express();
const jwt = require("express-jwt");
const jwks = require("jwks-rsa");
const axios = require("axios");
const jwtAuthz = require("express-jwt-authz");
const PORT = process.env.PORT || 8080;
require("dotenv").config();
app.use(cors());
app.use(express.json());
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

const checkPermissions = jwtAuthz(["read:workers"], {
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

app.get("/worker-validate", checkPermissions, async (req, res) => {
  res.send("Hello World from protected route");
});

app.listen(PORT, () => {
  console.log("Server running on PORT : " + PORT);
});
