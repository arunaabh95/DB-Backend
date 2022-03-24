
const pgp = require('pg-promise');

const connections = [];

const config1 = {
  dbHost: "redshift-cluster-1.cxze2a4aylyf.us-east-1.redshift.amazonaws.com",
  dbUser: "admin",
  dbPassword: "dbProject123"
}

const config2 = {
  dbHost: "redshift-cluster-1.cg1tjsuz22s0.us-east-1.redshift.amazonaws.com",
  dbUser: "anusha1",
  dbPassword: "Ashawonderilla#1"
};

async function getConnection (){
    const dbName = "dev";

    if (!connections[dbName]) {
      const dbUser = config2.dbUser;
      const dbPassword = config2.dbPassword;
      const dbHost = config2.dbHost;
      const dbPort = "5439";

      const dbc = pgp({ capSQL: true });
      console.log(`Opening connection to: ${dbName}, host is: ${dbHost}`);

      const connectionString = `postgres://${dbUser}:${encodeURIComponent(dbPassword)}@${dbHost}:${dbPort}/${dbName}`;
      connections[dbName] = dbc(connectionString);
    }

    return connections[dbName];
}

async function executeQuery(query) {
    try {
      const date1 = new Date().getTime();
      const connection = await getConnection();
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
        return {result:null, error:"error", time:-1}
      }
      return {result: result, error: null, time:durationMs};
    } catch (e) {
      console.error(`Error executing query: ${query} Error: ${e.message}`);
      return {result:null, error:e, time:-2};
    }
  }


module.exports = {executeQuery}