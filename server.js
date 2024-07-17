const express = require("express");
const app = express();
const simpsons = require("./simpsons.json");

app.get("/quotes", (req, res) => {
  let { character, count } = req.query;
  count = Number(count);

  //defensive checks
  if (count && (Number.isNaN(count) || count < 1)) {
    res.send("Sorry, bad count");
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

// console.log(process.env);
const port = process.env.PORT || 6001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
