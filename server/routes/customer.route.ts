import { Router } from "express";
import {
  archiveCustomerHandler,
  createCustomerHandler,
  getCustomerHandler,
  getCustomersHandler,
  updateCustomerHandler,
  deleteCustomerHandler,
} from "../controllers/customer.controller";

const customerRoutes = Router();

customerRoutes.get("/", getCustomersHandler);
customerRoutes.get("/:id", getCustomerHandler);
customerRoutes.post("/", createCustomerHandler);
customerRoutes.patch("/:id", updateCustomerHandler);
customerRoutes.post("/:id/archive", archiveCustomerHandler);
customerRoutes.delete("/:id", deleteCustomerHandler);

export default customerRoutes;
