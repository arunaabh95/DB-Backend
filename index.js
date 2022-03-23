const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/", router);
app.use(cors());

connection = null;
connectionType = "";

router.options('*', cors());

// Creating a POST route that returns data from the 'users' table.
router.post("/mysql", function (req, res) {
  const config = {
    host: "database-1.c46mesfnpyxo.us-east-1.rds.amazonaws.com",
    user: "admin",
    password: "dbproject123",
    database: "Instacart",
    port: 3306,
  };
  const query = req.body.query;
  console.log(req.body);
  if (connectionType != "mysql") {
      if (connectionType != "") {
          connection.close();
      }
  connection = mysql.createPool(config);
  }
  connectionType = "mysql";
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

app.post("/reshift", function (req, res) {
    const config = {
        host: "database-1.c46mesfnpyxo.us-east-1.rds.amazonaws.com",
        user: "admin",
        password: "12345678",
        database: "abc-retail",
        port: 3306,
      };
      const query = req.body.query;
      if (connectionType != "redshift") {
        if (connectionType != "") {
            connection.end();
        }
        connection = new Redshift(config);
      }
      connectionType = "mysql";
      res.set('Access-Control-Allow-Origin', "*");
      res.set('Content-Type', 'application/json');
      // Executing the MySQL query (select all data from the 'users' table).
      connection.query(query, function (error, results) {
        // If some error occurs, we throw an error.
        if (error) console.log(error);
        console.log(results);
        // Getting the 'response' from the database and sending it to our route. This is were the data is.
        res.send({results: results, error: error, time: time});
      });
});
// Starting our server.

server = app.listen(PORT, () => {
  console.log("Go to http://localhost:3000/mysql to see hello world");
});

function cleanup () {
    shutting_down = true;
    server.close( function () {
        console.log( "Closed out remaining connections.");
        if (connection) {
            if (connection.close)
                connection.close();
            if (connection.end) {
                connection.end()
            }
        }
       
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