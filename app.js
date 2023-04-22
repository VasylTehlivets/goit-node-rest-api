const express = require("express");
const logger = require("morgan");
const cors = require("cors");

require("./passport-config");

const contactsRouter = require("./routes/api/contactsRouter");
const authRouter = require("./routes/api/authRouter");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use("/api/contacts", contactsRouter);
app.use("/api/users", authRouter);

app.use((req, res) => {
  res.status(404).json({
    status: "Error",
    code: 404,
    message: `Use api on routes: 
    POST /api/users/signup - sign up user { email, password}
    POST /api/users/login - log in user { email, password }
    GET /api/users/logout - log out user { token }
    GET /api/users/current - get user's data
    GET /api/contacts - get user's contacts`,
    data: "Not found",
  });
});

app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).json({
    status: "Fail",
    code: 500,
    message: err.message,
    data: "Internal Server Error",
  });
});

module.exports = app;
