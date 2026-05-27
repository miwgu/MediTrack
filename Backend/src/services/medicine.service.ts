import { medicineRepository } from '../repositories/medicine.repository';
import { MedicineFilters, CreateMedicineDTO, UpdateMedicineDTO } from '../types/medicine.types';
import { AppError } from '../middleware/errorHandler';

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
   if (!data.name) throw new AppError("name is required", 400);
   if (data.stock < 0) throw new AppError("stock must be >= 0", 400);

   // check if atc_code is unique
   const existing = await medicineRepository.findByAtcCode(data.atc_code);
   if (existing) throw new AppError(`ATC code ${data.atc_code} is already in use`,400);

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
    if (!medicine) throw new AppError("Medicine not found", 404);
    if (!medicine.is_active) throw new AppError("Cannot update an inactive medicine", 400);

    // check if atc_code is unique
    if (data.atc_code) {
      const existing = await medicineRepository.findByAtcCode(data.atc_code, id);
      if (existing) throw new AppError(`ATC code ${data.atc_code} is already in use`, 400);
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
    const medicine = await medicineRepository.findById(id);
    if (!medicine) throw new AppError("Medicine not found", 404);
    if (!medicine.is_active) throw new AppError("Medicine is already inactive", 400);

    await medicineRepository.deactivate(id);
  },
};