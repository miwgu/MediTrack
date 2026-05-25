import { Router } from 'express';
import { getMedicines } from '../controllers/medicine.controller';

const router = Router();

router.get('/medicines', getMedicines);

export default router;