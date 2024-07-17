const express = require("express");
const app = express();
const simpsons = require("./simpsons.json");
simpsons.forEach((item, index) => {
  item.id = index + 1;
});
let lastId = simpsons.length;

app.use(express.static("public"));
app.use(express.json()); //access the body as an object
app.use(express.urlencoded({ extended: false })); //does not really apply to

app.get("/quotes/:count/:character", (req, res) => {
  console.log(req.params);
  let { character, count } = req.params;
  count = Number(count);
  //defensive checks
  if (count && (Number.isNaN(count) || count < 1)) {
    res.status(418).send("Sorry, bad count");
    return;
  }
  let _simpsons = [...simpsons];
  let _count = count || 1;
  if (character) {
    _simpsons = _simpsons.filter((item) => {
      return item.character.toLowerCase().includes(character.toLowerCase());
    });
  }
  if (_count < _simpsons.length) {
    _simpsons.length = _count;
  }
  res.send(_simpsons);
});

app.delete("/quotes/:id", (req, res) => {
  console.log(req.params.id);
  const { id } = req.params;

  const indexOf = simpsons.findIndex((item) => {
    return item.id === Number(id);
  });

  simpsons.splice(indexOf, 1);

  res.send({ status: 1 });
  res.status(200).json({ status: 1 });
});

app.post("/quotes", (req, res) => {
  lastId++;
  req.body.id = lastId;

  //check the data contains the correct stuff -- maybe joi

  simpsons.push(req.body);

  res.send({ status: 1 });
});

app.put("/quotes/:id", (req, res) => {
  const { id } = req.params;

  const indexOf = simpsons.findIndex((item) => {
    return item.id === Number(id);
  });

  if (indexOf < 0) {
    res.send({ status: 0, reason: "Character not found" });
    return;
  }

  simpsons[indexOf] = req.body;
  res.send({ status: 1 });
});

// console.log(process.env);
const port = process.env.PORT || 6001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
