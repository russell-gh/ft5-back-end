function genToken() {
  return Math.round(Math.random() * 1000000000000000) + "" + Date.now();
}

module.exports = { genToken };
