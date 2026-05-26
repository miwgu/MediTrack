import { MedicineForm } from '../../types/medicine.types';

export const getMedicineUnit = (form: MedicineForm | null): string => {
  switch (form) {
    case 'tablet':     return 'tablets';
    case 'capsule':    return 'capsules';
    case 'injection':  return 'vials';
    case 'inhalation': return 'inhalers';
    default:           return 'units';
  }
};