import { afterAll, beforeEach, describe, expect, it } from "bun:test";
import { prisma } from "../config/db";
import { createSale } from "../services/sale.service";
import {
  resetDatabase,
  seedCustomer,
  seedProduct,
  seedService,
  seedUserWithBusiness,
} from "./factories";

beforeEach(resetDatabase);
afterAll(async () => {
  await prisma.$disconnect();
});

describe("createSale — stock decrement", () => {
  it("decrements product quantity by the sold amount on a single-line cart", async () => {
    const { user, business } = await seedUserWithBusiness();
    const customer = await seedCustomer(business.id);
    const product = await seedProduct(business.id, { quantity: 10, price: 100 });

    await createSale({
      userId: user.id,
      customerId: customer.id,
      items: [{ productId: product.id, quantity: 3, unitPrice: 100 }],
      subtotalAmount: 300,
      totalAmount: 300,
    });

    const after = await prisma.product.findUniqueOrThrow({ where: { id: product.id } });
    expect(after.quantity).toBe(7);
  });

  it("decrements each product independently in a multi-line cart", async () => {
    const { user, business } = await seedUserWithBusiness();
    const customer = await seedCustomer(business.id);
    const a = await seedProduct(business.id, { name: "A", quantity: 20, price: 50 });
    const b = await seedProduct(business.id, { name: "B", quantity: 15, price: 100 });
    const c = await seedProduct(business.id, { name: "C", quantity: 30, price: 25 });

    await createSale({
      userId: user.id,
      customerId: customer.id,
      items: [
        { productId: a.id, quantity: 5, unitPrice: 50 },
        { productId: b.id, quantity: 2, unitPrice: 100 },
        { productId: c.id, quantity: 10, unitPrice: 25 },
      ],
      subtotalAmount: 700,
      totalAmount: 700,
    });

    const [afterA, afterB, afterC] = await Promise.all([
      prisma.product.findUniqueOrThrow({ where: { id: a.id } }),
      prisma.product.findUniqueOrThrow({ where: { id: b.id } }),
      prisma.product.findUniqueOrThrow({ where: { id: c.id } }),
    ]);
    expect(afterA.quantity).toBe(15);
    expect(afterB.quantity).toBe(13);
    expect(afterC.quantity).toBe(20);
  });

  it("buying the same product on two lines decrements by the sum of both lines", async () => {
    const { user, business } = await seedUserWithBusiness();
    const customer = await seedCustomer(business.id);
    const product = await seedProduct(business.id, { quantity: 20, price: 100 });

    await createSale({
      userId: user.id,
      customerId: customer.id,
      items: [
        { productId: product.id, quantity: 3, unitPrice: 100 },
        { productId: product.id, quantity: 4, unitPrice: 80 }, // different price, same SKU
      ],
      subtotalAmount: 620,
      totalAmount: 620,
    });

    const after = await prisma.product.findUniqueOrThrow({ where: { id: product.id } });
    expect(after.quantity).toBe(13);
  });

  it("does NOT decrement when the line is a service (services have no stock)", async () => {
    const { user, business } = await seedUserWithBusiness();
    const customer = await seedCustomer(business.id);
    const service = await seedService(business.id, { price: 500 });

    await createSale({
      userId: user.id,
      customerId: customer.id,
      items: [{ serviceId: service.id, quantity: 2, unitPrice: 500 }],
      subtotalAmount: 1000,
      totalAmount: 1000,
    });

    // service rows have no quantity field; just confirm sale was created
    const sales = await prisma.sale.findMany({ where: { businessId: business.id } });
    expect(sales).toHaveLength(1);
  });

  it("mixed product+service cart only decrements product stock", async () => {
    const { user, business } = await seedUserWithBusiness();
    const customer = await seedCustomer(business.id);
    const product = await seedProduct(business.id, { quantity: 10, price: 100 });
    const service = await seedService(business.id, { price: 500 });

    await createSale({
      userId: user.id,
      customerId: customer.id,
      items: [
        { productId: product.id, quantity: 4, unitPrice: 100 },
        { serviceId: service.id, quantity: 1, unitPrice: 500 },
      ],
      subtotalAmount: 900,
      totalAmount: 900,
    });

    const after = await prisma.product.findUniqueOrThrow({ where: { id: product.id } });
    expect(after.quantity).toBe(6);
  });

  it("refuses the sale when a line exceeds available stock — stock unchanged", async () => {
    const { user, business } = await seedUserWithBusiness();
    const customer = await seedCustomer(business.id);
    const product = await seedProduct(business.id, { quantity: 5, price: 100 });

    await expect(
      createSale({
        userId: user.id,
        customerId: customer.id,
        items: [{ productId: product.id, quantity: 10, unitPrice: 100 }],
        subtotalAmount: 1000,
        totalAmount: 1000,
      }),
    ).rejects.toThrow();

    const after = await prisma.product.findUniqueOrThrow({ where: { id: product.id } });
    expect(after.quantity).toBe(5); // unchanged — transaction rolled back
  });

  it("multi-line failure rolls back ALL decrements (one bad line → no stock movement)", async () => {
    const { user, business } = await seedUserWithBusiness();
    const customer = await seedCustomer(business.id);
    const good = await seedProduct(business.id, { name: "Good", quantity: 100, price: 10 });
    const bad = await seedProduct(business.id, { name: "Bad", quantity: 1, price: 10 });

    await expect(
      createSale({
        userId: user.id,
        customerId: customer.id,
        items: [
          { productId: good.id, quantity: 5, unitPrice: 10 },
          { productId: bad.id, quantity: 50, unitPrice: 10 }, // not enough stock
        ],
        subtotalAmount: 550,
        totalAmount: 550,
      }),
    ).rejects.toThrow();

    const [afterGood, afterBad] = await Promise.all([
      prisma.product.findUniqueOrThrow({ where: { id: good.id } }),
      prisma.product.findUniqueOrThrow({ where: { id: bad.id } }),
    ]);
    expect(afterGood.quantity).toBe(100); // rolled back, NOT 95
    expect(afterBad.quantity).toBe(1);
  });

  it("flags low-stock when post-sale quantity falls at or below minimumQuantity", async () => {
    const { user, business } = await seedUserWithBusiness();
    const customer = await seedCustomer(business.id);
    const product = await seedProduct(business.id, {
      quantity: 10,
      minimumQuantity: 5,
      price: 100,
    });

    const result = await createSale({
      userId: user.id,
      customerId: customer.id,
      items: [{ productId: product.id, quantity: 6, unitPrice: 100 }],
      subtotalAmount: 600,
      totalAmount: 600,
    });

    expect(result.lowStockProducts).toHaveLength(1);
    expect(result.lowStockProducts[0]).toMatchObject({
      name: product.name,
      quantity: 4,
      minimumQuantity: 5,
    });
  });

  it("records an InventoryMovement row per product line", async () => {
    const { user, business } = await seedUserWithBusiness();
    const customer = await seedCustomer(business.id);
    const a = await seedProduct(business.id, { quantity: 10 });
    const b = await seedProduct(business.id, { quantity: 10 });

    await createSale({
      userId: user.id,
      customerId: customer.id,
      items: [
        { productId: a.id, quantity: 2, unitPrice: 100 },
        { productId: b.id, quantity: 3, unitPrice: 100 },
      ],
      subtotalAmount: 500,
      totalAmount: 500,
    });

    const movements = await prisma.inventoryMovement.findMany({
      where: { businessId: business.id },
    });
    expect(movements).toHaveLength(2);
    expect(movements.every((m) => m.type === "DECREASE")).toBe(true);
  });
});
