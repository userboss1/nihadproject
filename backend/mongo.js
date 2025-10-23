import { MongoClient } from 'mongodb';

let db = null;

export async function connect(done) {
  const url = 'mongodb+srv://carsadhil:amkygWhmyPTdd2kl@cluster0.jdva4.mongodb.net/?appName=Cluster0' 
  const dbName = 'mydb';

  try {
    const client = await MongoClient.connect(url);
    db = client.db(dbName);
    done();
  } catch (err) {
    done(err);
  }
}

export function get() {
  return db;
}
