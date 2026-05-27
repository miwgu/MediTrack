import { Request, Response } from "express";
import { medicineService } from "../services/medicine.service";
import { MedicineForm, CreateMedicineDTO, UpdateMedicineDTO } from "../types/medicine.types";

export const getAllMedicines = async (req: Request, res: Response): Promise<void> => {
  const { search, form } = req.query;

  const data = await medicineService.getAll({
    search: search as string,
    form: form as MedicineForm,
  });

  res.json(data);
};

export const getMedicineById = async (req: Request,res: Response): Promise<void> => {
  const id = Number(req.params.id);
  const data = await medicineService.getById(id);

    if (!data) {
    res.status(404).json({
      message: "Medicine not found",
    });

    return;
  }

  res.json(data);
};

export const createMedicine = async (req: Request, res: Response): Promise<void> => {
  try {
    const data: CreateMedicineDTO = req.body;
    const created = await medicineService.create(data);
    res.status(201).json(created);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const updateMedicine = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const data: UpdateMedicineDTO = req.body;
    const updated = await medicineService.update(id, data);
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteMedicine = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    await medicineService.delete(id);
    res.status(204).send();
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
