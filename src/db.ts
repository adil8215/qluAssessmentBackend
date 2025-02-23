import { Client } from "pg";

// Create a PostgreSQL client instance
const client = new Client({
  host: process.env.host,
  port: Number(process.env.dbPort),
  user: process.env.dbUser,
  password: process.env.dbPassword,
  database: process.env.databaseName,
});

// Connect to the database

client
  .connect()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch((err) => console.error("Failed to connect to PostgreSQL", err));

export default client;
