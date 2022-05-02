const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const redshift = require('./redshift');
const PORT = process.env.PORT || 3000;
let connectionMap = {}; 

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/", router);
app.use(cors());

const instacartSqlConnection = mysql.createConnection( {
  host: "database-1.c7si7t7vgrgx.us-east-1.rds.amazonaws.com",
  user: "admin",
  password: "dbproject123",
  database: "Instacart",
  port: 3306,
});

const abcSqlConnection = mysql.createConnection( {
  host: "database-1.c7si7t7vgrgx.us-east-1.rds.amazonaws.com",
  user: "admin",
  password: "dbproject123",
  database: "ABCRetail",
  port: 3306,
});


connectionMap["Instacart"] = instacartSqlConnection;
connectionMap["ABCRetail"] = abcSqlConnection;

router.options('*', cors());

router.post("/mysql", function (req, res) {
  const query = req.body.query;
  const dbName = req.body.dbName;
  console.log(dbName);
  console.log(query);
  let connection = connectionMap[dbName];
  if (!connection) {
    console.log("Here");
    res.send({results:null, err:"No connection found for database: " + dbName, time:-1});
    return;
  }
  console.log(req.body);
  res.set('Access-Control-Allow-Origin', "*");
  res.set('Content-Type', 'application/json');
  // Executing the MySQL query (select all data from the 'users' table).
  const startTime = Date.now();
  connection.query(query, function (error, results) {
    // If some error occurs, we throw an error.
    if (error) console.log(error);
    const time = Date.now() - startTime;
    console.log(results);
    // Getting the 'response' from the database and sending it to our route. This is were the data is.
    res.send({results: results, error: error, time: time});
  });
});

 // Creating a POST route that returns data from the 'users' table.
router.post("/redshift", function (req, res) {
  const query = req.body.query;
  const dbName = req.body.dbName;
  console.log(req.body);
  res.set('Access-Control-Allow-Origin', "*");
  res.set('Content-Type', 'application/json');
  // Executing the MySQL query (select all data from the 'users' table).
  redshift.executeQuery(query, dbName).then((results) => res.send(results));
});
// Starting our server.

server = app.listen(PORT, () => {
  console.log("Go to http://localhost:3000/mysql to see hello world");
});

function cleanup () {
    shutting_down = true;
    server.close( function () {
        console.log( "Closed out remaining connections.");
        instacartSqlConnection.end();
        abcSqlConnection.end();
        // Close db connections, other chores, etc.
        process.exit();
    });
  
    setTimeout( function () {
     console.error("Could not close connections in time, forcing shut down");
     process.exit(1);
    }, 30*1000);
  
  }
  
  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
  process.on('SIGQUIT', cleanup)