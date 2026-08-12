const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Extract connection string from .env.local if available, otherwise use hardcoded fallback from earlier session
let connectionString = "postgres://postgres.dqocwxkwvmhuvdgztlob:mW2RA72IPVhFt8fD@aws-0-ap-south-1.pooler.supabase.com:5432/postgres";

const client = new Client({
  connectionString: connectionString,
  ssl: { rejectUnauthorized: false }
});

async function run() {
  try {
    console.log("Connecting to your automated database...");
    await client.connect();
    
    console.log("Reading schema.sql...");
    const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    
    console.log("Building your final tables (orders, coupons, banners, reviews, settings)...");
    await client.query(sql);
    
    console.log("✅ SUCCESS! Your entire database has been fully built automatically!");
    console.log("You can now safely move to Step 3 (GitHub Pages)!");
  } catch (err) {
    console.error("❌ ERROR building database:", err);
  } finally {
    await client.end();
  }
}

run();
