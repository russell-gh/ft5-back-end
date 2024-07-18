const express = require("express");
const router = express.Router();
const { userSchema } = require("../validation/joi");
const { genToken } = require("../utils");

function checkToken(req, res, next) {
  const { token } = req.headers;
  if (!token) {
    res.status(400).send({ status: 0, reason: "No token" });
    return;
  }

  const user = req.users.find((user) => {
    return user.token === token;
  });

  if (!user) {
    res.status(400).send({ status: 0, reason: "Invalid token" });
    return;
  }

  req.authedUser = user;
  next();
}

// router.get("/", (req, res) => {
//   res.send(req.users);
// });

router.post("/", (req, res) => {
  const valResult = userSchema.validate(req.body);

  if (valResult.error) {
    res.status(400).send({ status: 0, reason: "Input data failed validation" });
    return;
  }

  const indexOf = req.users.findIndex((user) => {
    return user.email.toLowerCase() === req.body.email.toLowerCase();
  });

  if (indexOf >= 0) {
    res.status(400).send({ status: 0, reason: "Existing user" });
    return;
  }

  req.users.push(req.body);
  res.send({ status: 1 });
});

router.post("/login", (req, res) => {
  //check the creds match what was originally entered
  const user = req.users.find((user) => {
    return (
      user.email.toLowerCase() === req.body.email.toLowerCase() &&
      user.password.toLowerCase() === req.body.password.toLowerCase()
    );
  });

  if (!user) {
    res.status(400).send({ status: 0, reason: "Invalid email/password combo" });
  }

  //generate a shared secret
  const token = genToken();

  //store the shared secret locally
  user.token = token;

  //send the shared secret to the user
  res.send({ status: 1, token });
});

router.patch("/", checkToken, (req, res) => {
  req.authedUser.secret = req.body.secret;
  res.send({ status: 1 });
});

router.get("/", checkToken, (req, res) => {
  res.send({ user: req.authedUser });
});

module.exports = router;
