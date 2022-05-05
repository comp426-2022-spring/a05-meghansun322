// Place your server entry point code here
const args = require("minimist")(process.argv.slice(2));

const help = `
server.js [options]
--port, -p	Set the port number for the server to listen on. Must be an integer
            between 1 and 65535.
--debug, -d If set to true, creates endlpoints /app/log/access/ which returns
            a JSON access log from the database and /app/error which throws 
            an error with the message "Error test successful." Defaults to 
            false.
--log		If set to false, no log files are written. Defaults to true.
            Logs are always written to database.
--help, -h	Return this message and exit.
`;
// If --help, echo help text and exit
if (args.help || args.h) {
  console.log(help);
  process.exit(0);
}

const express = require("express");
const fs = require("fs");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

//Require database SCRIPT file
var db = require("./src/services/database.js");

// Log arg
if (args.log == true) {
  const WRITESTREAM = fs.createWriteStream("access.log", { flags: "a" });
  app.use(morgan("combined", { stream: WRITESTREAM }));
} else {
  console.log("Server Is Not Creating a Log File.");
}

// DEBUG arg
if (args.debug === true) {
  // Returns all records on access log
  console.log("Create endpoint /app/log/access/");
  app.get("/app/log/access/", (req, res) => {
    const stmt = db.prepare("SELECT * FROM accesslog").all();
    res.status(200).send(stmt);
  });
  app.get("/app/error", (req, res) => {
    throw new Error("Error Test Successful.");
  });
} else {
  console.log("Debug is False");
}

// CLI arg
const port = args.port || process.env.PORT || 5000;

if (args.log == "false") {
  console.log("NOTICE: not creating file access.log");
} else {
  // Use morgan for logging to files
  const logdir = "./data/log/";

  if (!fs.existsSync(logdir)) {
    fs.mkdirSync(logdir);
  }
  // Create a write stream to append to an access.log file
  const accessLog = fs.createWriteStream(logdir + "access.log", { flags: "a" });
  // Set up the access logging middleware
  app.use(morgan("combined", { stream: accessLog }));
}

// MIDDLEWARE for database
app.use((req, res, next) => {
  let logdata = {
    remoteaddr: req.ip,
    remoteuser: req.user,
    time: Date.now(),
    method: req.method,
    url: req.url,
    protocol: req.protocol,
    httpversion: req.httpVersion,
    status: res.statusCode,
    referrer: req.headers["referrer"],
    useragent: req.headers["user-agent"],
  };

  const stmt = db.prepare(
    "INSERT INTO accesslog (remoteaddr, remoteuser, time, method, url, protocol, httpversion, status, referrer, useragent) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
  );
  const info = stmt.run(
    logdata.remoteaddr,
    logdata.remoteuser,
    logdata.time,
    logdata.method,
    logdata.url,
    logdata.protocol,
    logdata.httpversion,
    logdata.status,
    logdata.referrer,
    logdata.useragent
  );
  next();
});

// Serve static HTML files
app.use(express.static("./public"));

// FUNCTIONS
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
  console.log("call", call);
  var return_statement = {
    call: call,
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

//ENDPOINTS

// READ (HTTP method GET) at root endpoint /app/
app.get("/app/", (req, res, next) => {
  res.json({ message: "Your API works! (200)" });
  res.status(200);
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

const server = app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});

// Tell STDOUT that the server is stopped
process.on("SIGINT", () => {
  server.close(() => {
    console.log("\nApp stopped.");
  });
});
