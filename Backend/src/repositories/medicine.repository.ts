import { db } from "../db/db";
import { Medicine, MedicineFilters, CreateMedicineDTO, UpdateMedicineDTO } from "../types/medicine.types";

export const medicineRepository = {
  async findAll(): Promise<Medicine[]> {
    const result = await db.query(
        "SELECT * FROM medicines ORDER BY id ASC"
    );
    return result.rows;
  },

  async findById(id: number): Promise<Medicine | null> {
    const result = await db.query(
        "SELECT * FROM medicines WHERE id = $1", [id]
    );
    return result.rows[0] ?? null;
  },

  async findByFilter(filters: MedicineFilters): Promise<Medicine[]> {
    const { search, form } = filters;
    const result = await db.query(
      `
      SELECT * FROM medicines
      WHERE ($1::text IS NULL OR name ILIKE '%' || $1 || '%' OR atc_code ILIKE '%' || $1 || '%')
      AND ($2::text IS NULL OR form ILIKE '%' || $2 || '%')
      ORDER BY id ASC
      `,
      [search ?? null, form ?? null]
    );
    return result.rows;
  },

  async create(data: CreateMedicineDTO): Promise<Medicine> {
    const result = await db.query(
        `INSERT INTO medicines
        (name, atc_code, form, strength, stock, threshold)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *`,
        [
        data.name,
        data.atc_code,
        data.form,
        data.strength,
        data.stock,
        data.threshold ?? 10,
        ]
    );

   return result.rows[0];
  },

async update(id: number, data: UpdateMedicineDTO): Promise<Medicine> {
  const fields = [];
  const values = [];
  let index = 1;

  if (data.name !== undefined) {
    fields.push(`name = $${index++}`);
    values.push(data.name);
  }
  if (data.atc_code !== undefined) {
    fields.push(`atc_code = $${index++}`);
    values.push(data.atc_code);
  }
  if (data.form !== undefined) {
    fields.push(`form = $${index++}`);
    values.push(data.form);
  }
  if (data.strength !== undefined) {
    fields.push(`strength = $${index++}`);
    values.push(data.strength);
  }
  if (data.stock !== undefined) {
    fields.push(`stock = $${index++}`);
    values.push(data.stock);
  }
  if (data.threshold !== undefined) {
    fields.push(`threshold = $${index++}`);
    values.push(data.threshold);
  }

  // when no fields are updated
  if (fields.length === 0) {
    const current = await db.query(
      "SELECT * FROM medicines WHERE id = $1", [id]
    );
    return current.rows[0];
  }

  fields.push(`updated_at = NOW()`);
  values.push(id);

  const result = await db.query(
    `UPDATE medicines SET ${fields.join(", ")} WHERE id = $${index} RETURNING *`,
    values
  );

  return result.rows[0];
},

  async deleteById(id: number): Promise<void> {
    await db.query(
        "DELETE FROM medicines WHERE id = $1", [id]
    );
  },
};