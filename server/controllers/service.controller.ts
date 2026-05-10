import z from "zod";
import { CREATED, OK, UNAUTHORIZED } from "../constants/http";
import {
  createService,
  deleteService,
  getServiceById,
  getServices,
  updateService,
} from "../services/service.service";
import appAssert from "../utils/appAssert";
import catchErrors from "../utils/catchErrors";
import {
  createServiceSchema,
  getServicesQuerySchema,
  updateServiceSchema,
} from "./service.schemas";

export const createServiceHandler = catchErrors(async (req, res) => {
  const userId = req.userId;
  appAssert(userId, UNAUTHORIZED, "not authenticated");

  const request = createServiceSchema.parse(req.body);
  const service = await createService({
    userId,
    ...request,
  });

  return res.status(CREATED).json({
    message: "service created",
    service,
  });
});

export const getServicesHandler = catchErrors(async (req, res) => {
  const userId = req.userId;
  appAssert(userId, UNAUTHORIZED, "not authenticated");

  const query = getServicesQuerySchema.parse(req.query);
  const services = await getServices({
    userId,
    page: query.page,
    limit: query.limit,
    category: query.category,
    search: query.search,
  });

  return res.status(OK).json(services);
});

export const getServiceHandler = catchErrors(async (req, res) => {
  const userId = req.userId;
  appAssert(userId, UNAUTHORIZED, "not authenticated");

  const serviceId = z.string().uuid().parse(req.params.id);
  const service = await getServiceById(userId, serviceId);

  return res.status(OK).json(service);
});

export const updateServiceHandler = catchErrors(async (req, res) => {
  const userId = req.userId;
  appAssert(userId, UNAUTHORIZED, "not authenticated");

  const serviceId = z.string().uuid().parse(req.params.id);
  const request = updateServiceSchema.parse(req.body);
  const service = await updateService({
    userId,
    serviceId,
    ...request,
  });

  return res.status(OK).json({
    message: "service updated",
    service,
  });
});

export const deleteServiceHandler = catchErrors(async (req, res) => {
  const userId = req.userId;
  appAssert(userId, UNAUTHORIZED, "not authenticated");

  const serviceId = z.string().uuid().parse(req.params.id);
  await deleteService(userId, serviceId);

  return res.status(OK).json({
    message: "service deleted",
  });
});
