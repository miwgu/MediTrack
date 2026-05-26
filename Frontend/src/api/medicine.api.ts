import { Medicine, MedicineForm } from '../types/medicine.types';

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

  create: async (data: Omit<Medicine, 'id' | 'created_at' | 'updated_at'>): Promise<Medicine> => {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  update: async (id: number, data: Partial<Medicine>): Promise<Medicine> => {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  delete: async (id: number): Promise<void> => {
    await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
  },
};