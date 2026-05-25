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
    const { name, atc_code, form } = filters;
    const result = await db.query(
        `
        SELECT * FROM medicines
        WHERE ($1::text IS NULL OR name ILIKE '%' || $1 || '%')
        AND ($2::text IS NULL OR atc_code ILIKE '%' || $2 || '%')
        AND ($3::text IS NULL OR form ILIKE '%' || $3 || '%')
        ORDER BY id ASC
        `,
        [name ?? null, atc_code ?? null, form ?? null]
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
  const result = await db.query(
    `UPDATE medicines SET
      name = $1,
      atc_code = $2,
      form = $3,
      strength = $4,
      stock = $5,
      threshold = $6,
      updated_at = NOW()
     WHERE id = $7
     RETURNING *`,
    [
      data.name,
      data.atc_code,
      data.form,
      data.strength,
      data.stock,
      data.threshold,
      id,
    ]
  );

  return result.rows[0];
},

  async deleteById(id: number): Promise<void> {
    await db.query(
        "DELETE FROM medicines WHERE id = $1", [id]
    );
  },
};