import { MongoClient } from 'mongodb';

let db = null;

export async function connect(done) {
  const url = 'mongodb://localhost:27017/' 
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
