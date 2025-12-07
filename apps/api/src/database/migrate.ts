import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: '../../.env' });

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is not defined');
  }

  const pool = new Pool({ connectionString });
  const db = drizzle(pool);

  console.log('⏳ Running migrations...');

  const migrationsFolder = path.join(__dirname, 'migrations');

  await migrate(db, { migrationsFolder });

  console.log('✅ Migrations completed!');

  await pool.end();
}

main().catch((err) => {
  console.error('❌ Migration failed!', err);
  process.exit(1);
});
