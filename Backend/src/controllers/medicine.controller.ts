import { Request, Response } from "express";
import { medicineService } from "../services/medicine.service";
import { CreateMedicineDTO, UpdateMedicineDTO } from "../types/medicine.types";

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

    if (!data) {
    res.status(404).json({
      message: "Medicine not found",
    });

    return;
  }

  res.json(data);
};

export const createMedicine = async (req: Request, res: Response): Promise<void> => {
  const data: CreateMedicineDTO = req.body;

  const created = await medicineService.create(data);
  res.status(201).json(created);
};

export const updateMedicine = async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id);
  const data: UpdateMedicineDTO = req.body;

  const updated = await medicineService.update(id, data);
  res.json(updated);
};

export const deleteMedicine = async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id);

  await medicineService.delete(id);
  res.status(204).send();
};
