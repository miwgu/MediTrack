export type MedicineForm = "tablet" | "capsule" | "injection" | "inhalation";

export type Medicine = {
  id: number;
  name: string;
  atc_code: string;
  form: string | null;
  strength: string | null;
  stock: number;
  threshold: number;
  is_active: boolean; 
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
  search?: string;
  form?: MedicineForm;
};