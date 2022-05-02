const pgp = require("pg-promise");

const connections = [];

const config1 = {
  dbHost: "redshift-cluster-1.c7z1wfawacda.us-east-1.redshift.amazonaws.com",
  dbUser: "dev",
  dbPassword: "Goforit123!",
  databaseName: "abc_retail",
};

const config2 = {
  dbHost: "redshift-cluster-1.cg1tjsuz22s0.us-east-1.redshift.amazonaws.com",
  dbUser: "anusha1",
  dbPassword: "Ashawonderilla#1",
  databaseName: "dev",
};

async function makeConnection(config, databaseName) {
  if (!connections[databaseName]) {
    const dbUser = config.dbUser;
    const dbPassword = config.dbPassword;
    const dbHost = config.dbHost;
    const dbPort = "5439";

    const dbc = pgp({ capSQL: true });
    console.log(`Opening connection to: ${databaseName}, host is: ${dbHost}`);

    const connectionString = `postgres://${dbUser}:${encodeURIComponent(
      dbPassword
    )}@${dbHost}:${dbPort}/${databaseName}`;
    connections[databaseName] = dbc(connectionString);
  }
}

function getConnection(dbName) {
  return connections[dbName] || null;
}

async function executeQuery(query, databaseName) {
  try {
    const date1 = new Date().getTime();
    const connection = getConnection(databaseName);
    console.log(connection);
    const result = await connection.query(query);
    const date2 = new Date().getTime();
    const durationMs = date2 - date1;
    const durationSeconds = Math.round(durationMs / 1000);
    let dataLength = 0;

    if (result && result.length) dataLength = result.length;

    console.log(
      `[Redshift] [${durationMs}ms] [${durationSeconds}s] [${dataLength.toLocaleString()} records] ${query}`
    );
    if (result == 0) {
      return { result: null, error: "error", time: -1 };
    }
    return { result: result, error: null, time: durationMs };
  } catch (e) {
    console.error(`Error executing query: ${query} Error: ${e.message}`);
    return { result: null, error: e, time: -2 };
  }
}

makeConnection(config1, config1.databaseName);
makeConnection(config2, config2.databaseName);

module.exports = { executeQuery };
