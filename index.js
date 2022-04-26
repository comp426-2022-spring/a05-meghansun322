// Place your server entry point code here
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();
// Make Express use its own built-in body parser to handle JSON
app.use(express.json());
app.use(cors());
//Require database SCRIPT file
var db = require("database");

const args = require("minimist")(process.argv.slice(2));

const port = args.port || process.env.PORT || 5000;

// Serve static HTML files
app.use(express.static("./public"));

function coinFlip() {
  var result;
  var rand_num = Math.random();

  if (rand_num < 0.5) {
    result = "heads";
  } else {
    result = "tails";
  }
  return result;
}

function coinFlips(flips) {
  let flip_list = [];
  let i = 0;
  while (i < flips) {
    flip_list.push(coinFlip());
    i++;
  }
  return flip_list;
}

function countFlips(array) {
  var counter;
  var heads = 0;
  var tails = 0;
  var i = 0;
  while (i < array.length) {
    if (array[i] === "tails") {
      tails = tails + 1;
    } else {
      heads = heads + 1;
    }
    i++;
  }
  if (heads == 0) {
    counter = { tails };
  } else if (tails == 0) {
    counter = { heads };
  } else {
    counter = { tails, heads };
  }
  return counter;
}

function flipACoin(call) {
  var return_statement = {
    call,
    flip: coinFlip(),
    result: "",
  };

  if (return_statement.call === return_statement.flip) {
    return_statement.result = "win";
  } else {
    return_statement.result = "lose";
  }
  return return_statement;
}

const server = app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});

app.get("/app", (req, res) => {
  res.status(200).end("OK");
  res.type("text/plain");
});

app.get("/app/echo/:number", (req, res) => {
  res.status(200).json({ message: req.params.number });
  res.type("text/plain");
});
// Put listen at the end
app.get("/app/flip", (req, res) => {
  var flip = coinFlip();
  res.status(200).json({ flip: flip });
  res.type("text/plain");
});

app.get("/app/flips/:number", (req, res) => {
  var flip = coinFlips(req.params.number);
  var summary = countFlips(flip);
  res.status(200).json({ raw: flip, summary: summary });
  res.type("text/plain");
});

app.post("/app/flip/coins/", (req, res, next) => {
  const flips = coinFlips(req.body.number);
  const count = countFlips(flips);
  res.status(200).json({ raw: flips, summary: count });
});

app.post("/app/flip/call/", (req, res, next) => {
  const game = flipACoin(req.body.guess);
  res.status(200).json(game);
});

app.use(function (req, res) {
  res.status(404).end("404 NOT FOUND");
  res.type("text/plain");
});
