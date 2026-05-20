import { hashValue } from "../utils/bcrypt";
import { prisma } from "../config/db";

export const resetDatabase = async () => {
  await prisma.$executeRawUnsafe(`
    TRUNCATE TABLE
      "Payment",
      "Invoice",
      "SaleItem",
      "Sale",
      "InventoryMovement",
      "Product",
      "Service",
      "Customer",
      "verification_codes",
      "Session",
      "Business",
      "User"
    RESTART IDENTITY CASCADE
  `);
};

type SeedOptions = {
  password?: string;
  email?: string;
  businessName?: string;
};

export const seedUserWithBusiness = async (opts: SeedOptions = {}) => {
  const password = opts.password ?? "Password123!";
  const hashed = await hashValue(password);
  const suffix = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const user = await prisma.user.create({
    data: {
      email: opts.email ?? `user-${suffix}@test.local`,
      password: hashed,
      // name is @unique — per-test suffix prevents collision
      name: `test-user-${suffix}`,
      verified: true,
    },
  });
  const business = await prisma.business.create({
    data: {
      ownerId: user.id,
      name: opts.businessName ?? "Test Business",
    },
  });
  return { user, business, plainPassword: password };
};

export const seedCustomer = async (businessId: string, overrides: Partial<{ name: string; mobile: string }> = {}) =>
  prisma.customer.create({
    data: {
      businessId,
      name: overrides.name ?? "Test Customer",
      mobile: overrides.mobile ?? `9${Math.floor(Math.random() * 1_000_000_000)}`.slice(0, 10),
    },
  });

export const seedProduct = async (
  businessId: string,
  overrides: Partial<{
    name: string;
    category: string;
    price: number;
    costPrice: number;
    quantity: number;
    minimumQuantity: number;
  }> = {},
) =>
  prisma.product.create({
    data: {
      businessId,
      name: overrides.name ?? "Test Product",
      category: overrides.category ?? "general",
      price: overrides.price ?? 100,
      costPrice: overrides.costPrice ?? 60,
      quantity: overrides.quantity ?? 10,
      minimumQuantity: overrides.minimumQuantity ?? 2,
    },
  });

export const seedService = async (
  businessId: string,
  overrides: Partial<{ name: string; price: number; costPrice: number }> = {},
) =>
  prisma.service.create({
    data: {
      businessId,
      name: overrides.name ?? "Test Service",
      price: overrides.price ?? 500,
      costPrice: overrides.costPrice ?? 200,
    },
  });
