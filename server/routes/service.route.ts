import { Router } from "express";
import {
  createServiceHandler,
  deleteServiceHandler,
  getServiceHandler,
  getServicesHandler,
  updateServiceHandler,
} from "../controllers/service.controller";

const serviceRoutes = Router();

serviceRoutes.get("/", getServicesHandler);
serviceRoutes.get("/:id", getServiceHandler);
serviceRoutes.post("/", createServiceHandler);
serviceRoutes.patch("/:id", updateServiceHandler);
serviceRoutes.delete("/:id", deleteServiceHandler);

export default serviceRoutes;
