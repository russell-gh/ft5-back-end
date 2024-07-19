const express = require("express");
const router = express.Router();
const { userSchema } = require("../validation/joi");
const { genToken } = require("../utils");
const sha256 = require("sha256");
const asyncMySQL = require("../mysql/connection");
const {
  addUser,
  getId,
  getIdFromToken,
  setSecret,
} = require("../mysql/queries");

async function checkToken(req, res, next) {
  const { token } = req.headers;
  if (!token) {
    res.status(400).send({ status: 0, reason: "No token" });
    return;
  }

  try {
    const results = await asyncMySQL(getIdFromToken(req.headers.token));

    if (!results) {
      throw new Error("Token not found");
    }

    req.authedUserId = results[0].user_id;

    next();
  } catch (e) {
    res.status(400).send({ status: 0, reason: "Bad token" });
  }
}

router.get("/ALL", (req, res) => {
  res.send(req.users);
});

//register
router.post("/", async (req, res) => {
  const valResult = userSchema.validate(req.body);

  if (valResult.error) {
    res.status(400).send({ status: 0, reason: "Input data failed validation" });
    return;
  }

  req.body.password = sha256(process.env.SALT + req.body.password);

  try {
    await asyncMySQL(addUser(req.body.email, req.body.password));
  } catch (e) {
    if (e.code === "ER_DUP_ENTRY") {
      res.send({ status: 0, error: "Exiting user" });
    } else {
      res.send({ status: 0, error: "Unknown error" });
    }

    return;
  }

  res.send({ status: 1 });
});

router.post("/login", async (req, res) => {
  const candidatePassword = sha256(process.env.SALT + req.body.password);

  try {
    const results = await asyncMySQL(getId(req.body.email, candidatePassword));

    if (!results) {
      throw new Error("No results");
    }

    const token = genToken();
    await asyncMySQL(addToken(results[0].id, token));
    res.send({ status: 1, token });
  } catch (e) {
    res.status(400).send({ status: 0, reason: "Invalid email/password combo" });
  }
});

router.patch("/", checkToken, async (req, res) => {
  await asyncMySQL(setSecret(req.authedUserId, req.body.secret));

  res.send({ status: 1 });
});

router.get("/", checkToken, (req, res) => {
  res.send({ user: req.authedUser });
});

module.exports = router;
