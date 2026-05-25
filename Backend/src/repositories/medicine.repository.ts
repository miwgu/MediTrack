import { db } from "../db/db";
import { Medicine } from "../types/medicine.types";

export const medicineRepository = {
  async findAll(): Promise<Medicine[]> {
    const result = await db.query("SELECT * FROM medicines ORDER BY id ASC");
    return result.rows;
  },

  async findById(id: number): Promise<Medicine | null> {
    const result = await db.query("SELECT * FROM medicines WHERE id = $1", [id]);
    return result.rows[0];
  },

  async findByFilter(name?: string, atc_code?: string, form?: string): Promise<Medicine[]> {
  const result = await db.query(
    `
    SELECT * FROM medicines
    WHERE ($1::text IS NULL OR name ILIKE '%' || $1 || '%')
      AND ($2::text IS NULL OR atc_code ILIKE '%' || $2 || '%')
      AND ($3::text IS NULL OR form ILIKE '%' || $3 || '%')
    ORDER BY id ASC
    `,
    [name || null, atc_code || null, form || null]
  );

   return result.rows;
  },

  async create(name: string, stock: number): Promise<Medicine> {
    const result = await db.query(
      "INSERT INTO medicines (name, stock) VALUES ($1, $2) RETURNING *",
      [name, stock]
    );
    return result.rows[0];
  },

  async update(id: number, name: string, stock: number): Promise<Medicine> {
    const result = await db.query(
      "UPDATE medicines SET name = $1, stock = $2, updated_at = NOW() WHERE id = $3 RETURNING *",
      [name, stock, id]
    );
    return result.rows[0];
  },

  async deleteById(id: number): Promise<void> {
    await db.query("DELETE FROM medicines WHERE id = $1", [id]);
  },
};