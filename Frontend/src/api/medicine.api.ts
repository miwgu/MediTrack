import { Medicine, MedicineForm, CreateMedicineDTO, UpdateMedicineDTO } from '../types/medicine.types';

const BASE_URL = 'http://localhost:3000/api/medicines';

export type MedicineFilters = {
  search?: string;
  form?: MedicineForm;
};

export const medicineApi = {
  getAll: async (filters: MedicineFilters = {}): Promise<Medicine[]> => {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.form) params.append('form', filters.form);

    const res = await fetch(`${BASE_URL}?${params.toString()}`);
    return res.json();
  },

  create: async (data: CreateMedicineDTO): Promise<Medicine> => {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to create medicine');
   }

    return res.json();
  },

  update: async (id: number, data: UpdateMedicineDTO): Promise<Medicine> => {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to update medicine');
    }

    return res.json();
  },

  delete: async (id: number): Promise<void> => {
    await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
  },
};