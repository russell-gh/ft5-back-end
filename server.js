require("dotenv").config();
console.log(process.env);
const express = require("express");
const app = express();
const users = [];

function addUsers(req, res, next) {
  req.users = users;
  next();
}

app.use(express.json());
app.use(addUsers);
app.use("/user", require("./routes/user"));

const port = process.env.PORT || 6001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
