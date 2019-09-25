var express = require('express');
var router = express.Router();

let mock = {
  user1: {
    age: 0
  },
  usereee1: {
    age: 0
  },
}

router.get('/', function (req, res) {
  res.set("Content-Type", "application/json")
  res.send(JSON.stringify(mock));
});

module.exports = router;
