import type { ResultSetHeader, RowDataPacket } from "mysql2";
import pool from "./db.js";
import { setTimeout } from "node:timers/promises";

async function waitForDatabase() {
  const retryableCodes = new Set([
    "ECONNREFUSED", "ECONNRESET", "ETIMEDOUT", "EAI_AGAIN",
    "PROTOCOL_CONNECTION_LOST", "ER_BAD_DB_ERROR", "ER_NO_SUCH_TABLE",
  ]);

  for (let attempt = 1; attempt <= 60; attempt++) {
    try {
      await pool.query("SELECT id FROM categories LIMIT 1");
      await pool.query("SELECT id FROM products LIMIT 1");
      return;
    } catch (error) {
      const code = (error as { code?: string }).code;
      if (!code || !retryableCodes.has(code) || attempt === 60) throw error;
      console.log(`Cekam MySQL i tabele (${attempt}/60)...`);
      await setTimeout(2000);
    }
  }
}

const categories = [
  {
    name: "Elektronika",
    products: [
      { name: "Bezicne slusalice", price: 59.99 },
      { name: "Bluetooth zvucnik", price: 39.99 },
      { name: "USB-C punjac", price: 19.99 },
    ],
  },
  {
    name: "Racunarska oprema",
    products: [
      { name: "Mehanicka tastatura", price: 89.99 },
      { name: "Bezicni mis", price: 24.99 },
      { name: "Monitor 24 inca", price: 149.99 },
    ],
  },
  {
    name: "Dom i kuhinja",
    products: [
      { name: "Elektricni ketler", price: 29.99 },
      { name: "Toster", price: 34.99 },
      { name: "Termos boca", price: 14.99 },
    ],
  },
  {
    name: "Sport",
    products: [
      { name: "Prostirka za vezbanje", price: 22.99 },
      { name: "Lopta za kosarku", price: 27.99 },
      { name: "Vijaca", price: 9.99 },
    ],
  },
];

async function seed() {
  const connection = await pool.getConnection();
  let addedCategories = 0;
  let addedProducts = 0;

  try {
    await connection.beginTransaction();

    for (const category of categories) {
      const [existing] = await connection.execute<(RowDataPacket & { id: number })[]>(
        "SELECT id FROM categories WHERE name = ? ORDER BY id LIMIT 1",
        [category.name],
      );
      let categoryId = existing[0]?.id;

      if (categoryId === undefined) {
        const [result] = await connection.execute<ResultSetHeader>(
          "INSERT INTO categories (name) VALUES (?)",
          [category.name],
        );
        categoryId = result.insertId;
        addedCategories++;
      }

      for (const product of category.products) {
        const [existingProducts] = await connection.execute<RowDataPacket[]>(
          "SELECT id FROM products WHERE name = ? AND category_id = ? LIMIT 1",
          [product.name, categoryId],
        );
        if (existingProducts.length > 0) continue;

        await connection.execute(
          "INSERT INTO products (name, price, category_id) VALUES (?, ?, ?)",
          [product.name, product.price, categoryId],
        );
        addedProducts++;
      }
    }

    await connection.commit();
    console.log(`Seed zavrsen: dodato ${addedCategories} kategorija i ${addedProducts} proizvoda.`);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

try {
  await waitForDatabase();
  await seed();
} catch (error) {
  console.error("Seed nije uspeo:", error);
  process.exitCode = 1;
} finally {
  await pool.end();
}
