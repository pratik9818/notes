// import { Client } from "pg";
const { Client } = require('pg')

async function connectdb() {
    let url = 'postgresql://notes_owner:h4qdpgHmyv9e@ep-broad-waterfall-a1y3ykrr.ap-southeast-1.aws.neon.tech/note?sslmode=require'
    let client = new Client({
        connectionString: url
    })
    client.connect()
    const createUserTableQuery = `
    CREATE TABLE notesusers(
        user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        id SERIAL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_verify BOOLEAN DEFAULT FALSE,
        last_login TEXT NOT NULL,
        auth TEXT DEFAULT 'Normal'
    )
`
    const createnotes = `
        CREATE TABLE notes(
            user_id TEXT NOT NULL,
            noteid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            notename VARCHAR(50) NULL,
            notedescription VARCHAR(50000) NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT NOT NULL
        )
`
    const addnewcolumns_in_note_table = `
        ALTER TABLE notes
        ADD COLUMN isshare BOOLEAN DEFAULT FALSE,
        ADD COLUMN ispublic BOOLEAN DEFAULT TRUE,
        ADD COLUMN access_type TEXT DEFAULT 'read',
        ADD COLUMN share_date TEXT DEFAULT NULL
`
    const deltetable = `DROP TABLE notes `
    // await client.query(createnotes)
    // await client.query(createUserTableQuery);
    // await client.query(deltetable);
    await client.query(addnewcolumns_in_note_table)
    console.log("Table created successfully!");


}
// connectdb()
exports.database = async function getClient() {
    const client = new Client("postgresql://notes_owner:h4qdpgHmyv9e@ep-broad-waterfall-a1y3ykrr-pooler.ap-southeast-1.aws.neon.tech/note?sslmode=require");
    await client.connect();
    return client;
}

