import { Router } from 'express';
import * as medicineController from '../controllers/medicine.controller';

const router = Router();

router.get("/", medicineController.getAllMedicines);
router.get("/:id", medicineController.getMedicineById);
router.post("/", medicineController.createMedicine);
router.patch("/:id", medicineController.updateMedicine);
router.delete("/:id", medicineController.deleteMedicine);

export default router;