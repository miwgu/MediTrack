import { medicineRepository } from '../repositories/medicine.repository';
import { MedicineFilters } from '../types/medicine.types';

export const medicineService = {
  getAll: (filters: MedicineFilters) => {
  return medicineRepository.findByFilter(
    filters.name,
    filters.atc_code,
    filters.form
   );
  },

  getById: async (id: number) => {
    return medicineRepository.findById(id);
  },

  create: async (name: string, stock: number) => {
    if (!name) throw new Error("name is required");
    if (stock < 0) throw new Error("stock must be >= 0");

    return medicineRepository.create(name, stock);
  },

  update: async (id: number, name: string, stock: number) => {
    return medicineRepository.update(id, name, stock);
  },

  delete: async (id: number) => {
    await medicineRepository.deleteById(id);
  },
};