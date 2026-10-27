// Applies supabase/migrations/*.sql to DATABASE_URL, once each, in name order.
// Usage: npm run db:migrate   (reads .env.local)
import fs from 'node:fs';
import path from 'node:path';
import pg from 'pg';

const root = path.resolve(import.meta.dirname, '..');
const dir = path.join(root, 'supabase', 'migrations');
const { DATABASE_URL, NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET } = process.env;

if (!DATABASE_URL) {
  console.error('DATABASE_URL is not set. Add it to .env.local.');
  process.exit(1);
}
if (!NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET) {
  console.error('NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET is not set. Add it to .env.local.');
  process.exit(1);
}

const ca = fs.readFileSync(path.join(root, 'certs', 'supabase-ca.crt'), 'utf8');
const client = new pg.Client({ connectionString: DATABASE_URL, ssl: { ca }, connectionTimeoutMillis: 15000 });

try {
  await client.connect();
} catch (e) {
  // Never print the error object: it can contain the connection string.
  console.error(`Could not connect to the database (${e.code || e.name}).`);
  process.exit(1);
}

try {
  await client.query(`create table if not exists public.schema_migrations (
    name text primary key,
    applied_at timestamptz not null default now()
  )`);
  await client.query('alter table public.schema_migrations enable row level security');
  const done = new Set((await client.query('select name from public.schema_migrations')).rows.map((r) => r.name));
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.sql')).sort();
  let applied = 0;
  for (const file of files) {
    if (done.has(file)) continue;
    const sql = fs.readFileSync(path.join(dir, file), 'utf8').replaceAll('{{SUPABASE_STORAGE_BUCKET}}', NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET);
    await client.query('begin');
    try {
      await client.query(sql);
      await client.query('insert into public.schema_migrations (name) values ($1)', [file]);
      await client.query('commit');
      console.log(`applied ${file}`);
      applied++;
    } catch (e) {
      await client.query('rollback');
      console.error(`failed ${file}: ${e.message}`);
      process.exitCode = 1;
      break;
    }
  }
  if (!applied && !process.exitCode) console.log('Database is up to date.');
} finally {
  await client.end();
}
