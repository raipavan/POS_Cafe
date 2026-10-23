import 'dotenv/config';
import pg from 'pg';
import fs from 'node:fs/promises';
import path from 'node:path';
const {Pool}=pg; const pool=new Pool({connectionString:process.env.DATABASE_URL});
try { const sql=await fs.readFile(new URL('../migrations/001_init.sql',import.meta.url),'utf8'); await pool.query(sql); console.log('Database migration complete.'); }
catch(e){console.error(e.message);process.exitCode=1;} finally {await pool.end();}
