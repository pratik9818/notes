// import { Client } from "pg";
const {Client} = require('pg')

async function connectdb(){
    let url = DATABASE_URL
    let client  = new Client({
      connectionString:  url
    })
    client.connect()
    const createUserTableQuery = `
    CREATE TABLE notesusers(
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_verify BOOLEAN DEFAULT FALSE
    )
`
const createnotes = `
        CREATE TABLE notes(
            noteid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            email VARCHAR(255) NOT NULL,
            notename VARCHAR(50) NULL,
            notedescription VARCHAR(50000) NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
`
const deltetable = `DROP TABLE notes `
// await client.query(createnotes)
await client.query(createUserTableQuery);
// await client.query(deltetable);
console.log("Table created successfully!");


}
// connectdb()
exports.database =  async function getClient() {
    const client = new Client(DATABASE_URL);
    await client.connect();
    return client;
}

