export type Medicine = {
  id: number;
  name: string;
  atc_code: string;
  form: string | null;
  strength: string | null;
  stock: number;
  threshold: number;
  created_at?: string;
  updated_at?: string;
};

export type CreateMedicineDTO = {
  name: string;
  atc_code: string;
  form?: string | null;
  strength?: string | null;
  stock: number;
  threshold?: number;
};

export type UpdateMedicineDTO = {
  name?: string;
  atc_code?: string;
  form?: string | null;
  strength?: string | null;
  stock?: number;
  threshold?: number;
};

export type MedicineFilters = {
  name?: string;
  atc_code?: string;
  form?: string;
};