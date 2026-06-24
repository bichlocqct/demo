const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Read env file manually to get DATABASE_URL since dotenv might not be configured
const envPath = path.join(__dirname, '..', '.env.local');
if (!fs.existsSync(envPath)) {
  console.error('Error: .env.local file not found at', envPath);
  process.exit(1);
}

const envFile = fs.readFileSync(envPath, 'utf8');
const dbUrlMatch = envFile.match(/^DATABASE_URL=(.+)$/m);

if (!dbUrlMatch) {
  console.error('Error: DATABASE_URL not found in .env.local');
  process.exit(1);
}

const connectionString = dbUrlMatch[1].trim();
const sqlPath = path.join(__dirname, '..', 'schema.sql');

if (!fs.existsSync(sqlPath)) {
  console.error('Error: schema.sql not found at', sqlPath);
  process.exit(1);
}

const sql = fs.readFileSync(sqlPath, 'utf8');

async function run() {
  console.log('Connecting to PostgreSQL database...');
  const client = new Client({ connectionString });
  try {
    await client.connect();
    console.log('Executing migration script (schema.sql)...');
    await client.query(sql);
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();
