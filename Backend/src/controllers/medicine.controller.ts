import { Request, Response } from 'express';

export const getMedicines = async (
  req: Request,
  res: Response
) => {
  res.json([
    {
      id: 1,
      name: 'Paracetamol',
      stock: 100,
    },
  ]);
};
