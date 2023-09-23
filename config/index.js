const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_URL

const client = new MongoClient(uri);

let db;

async function connect() {
  try {
    await client.connect();
    console.log("MongoDB Connected");
    db = client.db("AudioCentre");
  } catch (error) {
    await client.close();
  }
}

function getDB() {
  return db;
}

module.exports = { connect, getDB };
