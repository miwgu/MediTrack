import { Request, Response } from "express";
import { medicineService } from "../services/medicine.service";

export const getAllMedicines = async (req: Request, res: Response): Promise<void> => {
  const { name, atc_code, form } = req.query;

  const data = await medicineService.getAll({
    name: name as string,
    atc_code: atc_code as string,
    form: form as string,
  });

  res.json(data);
};

export const getMedicineById = async (req: Request,res: Response): Promise<void> => {
  const id = Number(req.params.id);
  const data = await medicineService.getById(id);

  res.json(data);
};

export const createMedicine = async (req: Request, res: Response): Promise<void> => {
  const { name, stock } = req.body;

  const created = await medicineService.create(name, stock);
  res.status(201).json(created);
};

export const updateMedicine = async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id);
  const { name, stock } = req.body;

  const updated = await medicineService.update(id, name, stock);
  res.json(updated);
};

export const deleteMedicine = async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id);

  await medicineService.delete(id);
  res.status(204).send();
};
