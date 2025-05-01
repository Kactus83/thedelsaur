import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Vérification des variables obligatoires
const required = [
  'MARIADB_HOST',
  'MARIADB_PORT',
  'MARIADB_USER',
  'MARIADB_PASSWORD',
  'MARIADB_DATABASE'
];
for (const v of required) {
  if (!process.env[v]) {
    throw new Error(`Variable d'environnement ${v} manquante`);
  }
}

const dbConfig = {
  host: process.env.MARIADB_HOST,
  port: Number(process.env.MARIADB_PORT),
  user: process.env.MARIADB_USER,
  password: process.env.MARIADB_PASSWORD,
  database: process.env.MARIADB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  multipleStatements: true,
};

const pool = mysql.createPool(dbConfig);

export default pool;
