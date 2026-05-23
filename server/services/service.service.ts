import type { Prisma } from "../generated/prisma/client";
import { prisma } from "../config/db";
import { CONFLICT, NOT_FOUND } from "../constants/http";
import { serviceSelect } from "../constants/service";
import appAssert from "../utils/appAssert";

export type CreateServiceParams = {
  userId: number;
  name: string;
  code?: string;
  costPrice: number;
  price: number;
};

export type UpdateServiceParams = {
  userId: number;
  serviceId: string;
  name?: string;
  code?: string | null;
  costPrice?: number;
  price?: number;
};

export type GetServicesParams = {
  userId: number;
  page?: number;
  limit?: number;
  search?: string;
};

const getBusinessByOwnerId = async (userId: number) => {
  const business = await prisma.business.findUnique({
    where: { ownerId: userId },
    select: { id: true },
  });
  appAssert(business, NOT_FOUND, "business not found");
  return business;
};

const getOwnedService = async (userId: number, serviceId: string) => {
  const business = await getBusinessByOwnerId(userId);

  const service = await prisma.service.findFirst({
    where: {
      id: serviceId,
      businessId: business.id,
    },
    select: {
      id: true,
      businessId: true,
      code: true,
    },
  });
  appAssert(service, NOT_FOUND, "service not found");

  return service;
};

const normalizeCodeBase = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 4)
    .map((word) => word.replace(/[^a-zA-Z0-9]/g, "").slice(0, 3))
    .filter(Boolean)
    .join("-")
    .toUpperCase()
    .slice(0, 20) || "SVC";

const generateUniqueCode = async (businessId: string, name: string) => {
  const base = `SVC-${normalizeCodeBase(name)}`;

  for (let attempt = 1; attempt <= 50; attempt += 1) {
    const suffix = attempt.toString().padStart(3, "0");
    const candidate = `${base}-${suffix}`;
    const existing = await prisma.service.findFirst({
      where: { businessId, code: candidate },
      select: { id: true },
    });

    if (!existing) {
      return candidate;
    }
  }

  appAssert(false, CONFLICT, "failed to generate unique service code");
};

export const createService = async (data: CreateServiceParams) => {
  const business = await getBusinessByOwnerId(data.userId);
  const code = data.code ?? (await generateUniqueCode(business.id, data.name));

  if (code) {
    const existing = await prisma.service.findFirst({
      where: { businessId: business.id, code },
      select: { id: true },
    });
    appAssert(!existing, CONFLICT, "service code already in use");
  }

  return prisma.service.create({
    data: {
      businessId: business.id,
      name: data.name,
      code,
      costPrice: data.costPrice,
      price: data.price,
    },
    select: serviceSelect,
  });
};

export const getServices = async (data: GetServicesParams) => {
  const business = await getBusinessByOwnerId(data.userId);
  const page = data.page ?? 1;
  const limit = data.limit ?? 10;
  const skip = (page - 1) * limit;

  const where: Prisma.ServiceWhereInput = {
    businessId: business.id,
    ...(data.search && {
      OR: [
        { name: { contains: data.search, mode: "insensitive" } },
        { code: { contains: data.search, mode: "insensitive" } },
      ],
    }),
  };

  const [services, total] = await prisma.$transaction([
    prisma.service.findMany({
      where,
      select: serviceSelect,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.service.count({ where }),
  ]);

  const allServices = await prisma.service.findMany({
    where: { businessId: business.id },
    select: { price: true, costPrice: true },
  });

  const summary = allServices.reduce(
    (acc, item) => {
      acc.totalServices += 1;
      acc.averagePrice += item.price;
      acc.projectedMargin += item.price - item.costPrice;
      return acc;
    },
    { totalServices: 0, averagePrice: 0, projectedMargin: 0 },
  );

  if (summary.totalServices > 0) {
    summary.averagePrice = Number(
      (summary.averagePrice / summary.totalServices).toFixed(2),
    );
  }

  return {
    services,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    summary: {
      totalServices: summary.totalServices,
      averagePrice: summary.averagePrice,
      projectedMargin: Number(summary.projectedMargin.toFixed(2)),
    },
  };
};

export const getServiceById = async (userId: number, serviceId: string) => {
  const owned = await getOwnedService(userId, serviceId);

  const service = await prisma.service.findUnique({
    where: { id: owned.id },
    select: serviceSelect,
  });
  appAssert(service, NOT_FOUND, "service not found");

  return service;
};

export const updateService = async (data: UpdateServiceParams) => {
  const service = await getOwnedService(data.userId, data.serviceId);

  if (data.code) {
    const existing = await prisma.service.findFirst({
      where: { businessId: service.businessId, code: data.code },
      select: { id: true },
    });
    appAssert(
      !existing || existing.id === service.id,
      CONFLICT,
      "service code already in use",
    );
  }

  return prisma.service.update({
    where: { id: service.id },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.code !== undefined && { code: data.code ?? null }),
      ...(data.costPrice !== undefined && { costPrice: data.costPrice }),
      ...(data.price !== undefined && { price: data.price }),
    },
    select: serviceSelect,
  });
};

export const deleteService = async (userId: number, serviceId: string) => {
  const service = await getOwnedService(userId, serviceId);

  const saleItem = await prisma.saleItem.findFirst({
    where: { serviceId: service.id },
    select: { id: true },
  });
  appAssert(
    !saleItem,
    CONFLICT,
    "service cannot be deleted after sales exist",
  );

  const deleted = await prisma.service.deleteMany({
    where: { id: service.id, businessId: service.businessId },
  });
  appAssert(deleted.count > 0, NOT_FOUND, "service not found");
};
