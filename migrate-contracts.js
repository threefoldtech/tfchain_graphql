require("dotenv").config();
const { Pool } = require("pg");
const axios = require("axios");
const { map, flatten } = require("lodash");
const format = require("pg-format");

const { DB_HOST, DB_NAME, DB_PASS, DB_PORT, DB_USER } = process.env;

async function main() {
  const config = {
    user: DB_USER,
    password: DB_PASS,
    port: DB_PORT,
    host: DB_HOST,
    database: DB_NAME,
  };

  const pool = new Pool(config);
  pool.on("error", (err, client) => {
    console.error("Unexpected error on idle client", err);
    process.exit(-1);
  });

  const client = await pool.connect();

  const nodeContractsQuery = {
    text: "SELECT * from node_contract",
  };
  const nodeContracts = await client.query(nodeContractsQuery);
  console.log(nodeContracts.rowCount);

  const rentContractsQuery = {
    text: "SELECT * from rent_contract",
  };
  const rentContracts = await client.query(rentContractsQuery);
  console.log(rentContracts.rowCount);
}
