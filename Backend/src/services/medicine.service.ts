import { medicineRepository } from '../repositories/medicine.repository';
import { MedicineFilters, CreateMedicineDTO, UpdateMedicineDTO } from '../types/medicine.types';

export const medicineService = {

  /**
   * Retrieves all active medicines, optionally filtered by search query and form.
   * @param filters - Optional filters: search (name or ATC code), form
   * @returns List of active medicines
   */
  getAll: (filters: MedicineFilters) => {
  return medicineRepository.findByFilter(filters);
  },

  /**
   * Retrieves a single active medicine by ID.
   * @param id - Medicine ID
   * @returns Medicine or null if not found
   */
  getById: async (id: number) => {
    return medicineRepository.findById(id);
  },

  /**
   * Creates a new medicine.
   * Validates required fields and checks for duplicate ATC code.
   * @param data - Medicine creation payload
   * @throws If name is missing, stock is negative, or ATC code already exists
   */
  create: async (data: CreateMedicineDTO) => {
   if (!data.name) throw new Error("name is required");
   if (data.stock < 0) throw new Error("stock must be >= 0");

   // check if atc_code is unique
   const existing = await medicineRepository.findByAtcCode(data.atc_code);
   if (existing) throw new Error(`ATC code ${data.atc_code} is already in use`);

   return medicineRepository.create(data);
 },

  /**
   * Updates an existing medicine.
   * Only active medicines can be updated.
   * Checks for duplicate ATC code, excluding the current medicine.
   * @param id - Medicine ID
   * @param data - Partial update payload
   * @throws If medicine not found, inactive, or ATC code already in use
   */
  update: async (id: number, data: UpdateMedicineDTO) => {

    // Chech if medicine is active
    const medicine = await medicineRepository.findById(id);
    if (!medicine) throw new Error("Medicine not found");
    if (!medicine.is_active) throw new Error("Cannot update an inactive medicine");

    // check if atc_code is unique
    if (data.atc_code) {
      const existing = await medicineRepository.findByAtcCode(data.atc_code, id);
      if (existing) throw new Error(`ATC code ${data.atc_code} is already in use`);
    }

   return medicineRepository.update(id, data);
},

  /**
   * Soft deletes a medicine by setting is_active to false.
   * Preserves order history integrity.
   * @param id - Medicine ID
   * @throws If medicine not found or already inactive
   */
  delete: async (id: number) => {
    await medicineRepository.deactivate(id);
  },
};