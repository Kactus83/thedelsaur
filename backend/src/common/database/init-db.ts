import { readFile } from 'fs/promises';
import { join } from 'path';
import pool from './db';

export async function initDbSchema(): Promise<void> {
  const conn = await pool.getConnection();
  try {
    console.log('🔄 Purge complète de la base de données…');
    // 1) désactive tous les checks FK
    await conn.query('SET FOREIGN_KEY_CHECKS = 0;');

    // 2) récupère la liste de toutes les tables dans le schéma courant
    const [rows]: any[] = await conn.query(
      `SELECT TABLE_NAME
         FROM INFORMATION_SCHEMA.TABLES
        WHERE TABLE_SCHEMA = DATABASE();`
    );
    for (const { TABLE_NAME } of rows) {
      await conn.query(`DROP TABLE IF EXISTS \`${TABLE_NAME}\`;`);
    }
    console.log('✅ Toutes les tables existantes ont été supprimées.');

    // 3) exécute votre init.sql comme avant
    console.log('🔄 Exécution de init.sql…');
    const sqlFile = join(__dirname, 'scripts', 'init.sql');
    const sql     = await readFile(sqlFile, 'utf8');
    await conn.query(sql);
    console.log('✅ init.sql exécuté.');

    // 4) réactive les checks FK
    await conn.query('SET FOREIGN_KEY_CHECKS = 1;');
  } finally {
    conn.release();
  }
}
