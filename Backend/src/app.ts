import express from "express";
import cors from "cors";
import medicineRoutes from "./routes/medicine.routes";
import orderRoutes from "./routes/order.routes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/medicines", medicineRoutes);
app.use("/api/orders", orderRoutes );

app.use(errorHandler); // must be registered LAST

export default app;