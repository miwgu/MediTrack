import { medicineRepository } from '../repositories/medicine.repository';
import { MedicineFilters, CreateMedicineDTO, UpdateMedicineDTO } from '../types/medicine.types';

export const medicineService = {
  getAll: (filters: MedicineFilters) => {
  return medicineRepository.findByFilter(filters);
  },

  getById: async (id: number) => {
    return medicineRepository.findById(id);
  },

  create: async (data: CreateMedicineDTO) => {
   if (!data.name) throw new Error("name is required");
   if (data.stock < 0) throw new Error("stock must be >= 0");

   return medicineRepository.create(data);
 },

  update: async (id: number, data: UpdateMedicineDTO) => {
    return medicineRepository.update(id, data);
  },

  delete: async (id: number) => {
    await medicineRepository.deleteById(id);
  },
};