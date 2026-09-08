import mysql from "mysql2/promise";
import "dotenv/config";

const getEnv = (name: string): string => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
};

const pool = mysql.createPool({
  host: getEnv("DB_HOST"),
  port: Number(getEnv("DB_PORT")),
  user: getEnv("DB_USER"),
  password: getEnv("DB_PASSWORD"),
  database: getEnv("DB_NAME"),
});

export default pool;