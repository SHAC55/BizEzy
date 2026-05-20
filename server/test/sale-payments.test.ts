import { afterAll, beforeEach, describe, expect, it } from "bun:test";
import { prisma } from "../config/db";
import { createSale, createSalePayment, getSaleById } from "../services/sale.service";
import {
  resetDatabase,
  seedCustomer,
  seedProduct,
  seedUserWithBusiness,
} from "./factories";

beforeEach(resetDatabase);
afterAll(async () => {
  await prisma.$disconnect();
});

const makeSale = async () => {
  const { user, business } = await seedUserWithBusiness();
  const customer = await seedCustomer(business.id);
  const product = await seedProduct(business.id, { quantity: 100, price: 200 });
  const result = await createSale({
    userId: user.id,
    customerId: customer.id,
    items: [{ productId: product.id, quantity: 5, unitPrice: 200 }],
    subtotalAmount: 1000,
    totalAmount: 1000,
    paidAmount: 0,
  });
  return { userId: user.id, businessId: business.id, customerId: customer.id, saleId: result.sale.id };
};

describe("createSalePayment — due math & status transitions", () => {
  it("a fresh sale with paidAmount=0 has dueAmount equal to totalAmount and status 'pending'", async () => {
    const { userId, saleId } = await makeSale();
    const sale = await getSaleById(userId, saleId);
    expect(sale.paidAmount).toBe(0);
    expect(sale.dueAmount).toBe(1000);
    expect(sale.status).toBe("pending");
  });

  it("an initial partial paidAmount at sale creation lands the sale in 'partial' state", async () => {
    const { user, business } = await seedUserWithBusiness();
    const customer = await seedCustomer(business.id);
    const product = await seedProduct(business.id, { quantity: 10, price: 100 });

    const result = await createSale({
      userId: user.id,
      customerId: customer.id,
      items: [{ productId: product.id, quantity: 1, unitPrice: 100 }],
      subtotalAmount: 100,
      totalAmount: 100,
      paidAmount: 40,
    });

    expect(result.sale.paidAmount).toBe(40);
    expect(result.sale.dueAmount).toBe(60);
    expect(result.sale.status).toBe("partial");
  });

  it("a single partial payment reduces due correctly and flips status to 'partial'", async () => {
    const { userId, saleId } = await makeSale();
    await createSalePayment({ userId, saleId, amount: 300 });
    const sale = await getSaleById(userId, saleId);
    expect(sale.paidAmount).toBe(300);
    expect(sale.dueAmount).toBe(700);
    expect(sale.status).toBe("partial");
  });

  it("two partial payments accumulate", async () => {
    const { userId, saleId } = await makeSale();
    await createSalePayment({ userId, saleId, amount: 300 });
    await createSalePayment({ userId, saleId, amount: 200 });
    const sale = await getSaleById(userId, saleId);
    expect(sale.paidAmount).toBe(500);
    expect(sale.dueAmount).toBe(500);
    expect(sale.status).toBe("partial");
  });

  it("a payment that clears the full due flips status to 'paid'", async () => {
    const { userId, saleId } = await makeSale();
    await createSalePayment({ userId, saleId, amount: 1000 });
    const sale = await getSaleById(userId, saleId);
    expect(sale.paidAmount).toBe(1000);
    expect(sale.dueAmount).toBe(0);
    expect(sale.status).toBe("paid");
  });

  it("clearing in two steps also results in status 'paid'", async () => {
    const { userId, saleId } = await makeSale();
    await createSalePayment({ userId, saleId, amount: 600 });
    await createSalePayment({ userId, saleId, amount: 400 });
    const sale = await getSaleById(userId, saleId);
    expect(sale.paidAmount).toBe(1000);
    expect(sale.dueAmount).toBe(0);
    expect(sale.status).toBe("paid");
  });

  it("rejects a payment that would exceed due — state unchanged", async () => {
    const { userId, saleId } = await makeSale();
    await createSalePayment({ userId, saleId, amount: 800 });

    await expect(
      createSalePayment({ userId, saleId, amount: 300 }), // total would be 1100 > 1000
    ).rejects.toThrow(/cannot exceed/i);

    const sale = await getSaleById(userId, saleId);
    expect(sale.paidAmount).toBe(800);
    expect(sale.dueAmount).toBe(200);
  });

  it("rejects payment on a paid-in-full sale", async () => {
    const { userId, saleId } = await makeSale();
    await createSalePayment({ userId, saleId, amount: 1000 });

    await expect(
      createSalePayment({ userId, saleId, amount: 1 }),
    ).rejects.toThrow();
  });

  it("payments by a different user (different business) are rejected", async () => {
    const { saleId } = await makeSale();
    const stranger = await seedUserWithBusiness({ email: "stranger@test.local" });

    await expect(
      createSalePayment({ userId: stranger.user.id, saleId, amount: 100 }),
    ).rejects.toThrow();
  });

  it("Payment table rows match the payment history", async () => {
    const { userId, saleId } = await makeSale();
    await createSalePayment({ userId, saleId, amount: 250 });
    await createSalePayment({ userId, saleId, amount: 150 });

    const rows = await prisma.payment.findMany({
      where: { saleId },
      orderBy: { createdAt: "asc" },
    });
    expect(rows.map((r) => r.amount)).toEqual([250, 150]);
  });
});
