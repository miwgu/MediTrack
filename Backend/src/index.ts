import dotenv from "dotenv";
dotenv.config();

import app from "./app";

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

/* import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import router from './src/routes/medicine.routes';
import './src/db/db';

const app = express();
const port = process.env.PORT || 3000;

const frontendOrigin = process.env.FRONTEND_ORIGIN

app.use(cors({
  origin: frontendOrigin,
}));

app.use(express.json());

app.use('/api', router);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
 */
