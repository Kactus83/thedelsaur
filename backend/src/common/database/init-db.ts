import { readFile } from 'fs/promises';
import { join } from 'path';
import pool from './db';

export async function initDbSchema(): Promise<void> {
  // chemin relatif depuis ce fichier
const sqlFile = join(__dirname, 'scripts', 'init.sql');
  const sql = await readFile(sqlFile, 'utf8');

  const conn = await pool.getConnection();
  try {
    console.log('🔄 Exécution de init.sql…');
    await conn.query(sql);
    console.log('✅ init.sql exécuté');
  } finally {
    conn.release();
  }
}