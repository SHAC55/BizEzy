import { describe, expect, it } from "bun:test";
import { computeSaleTotals } from "../utils/saleMath";

describe("computeSaleTotals (canonical GST/discount formula)", () => {
  it("subtotal sums quantity × unitPrice across items", () => {
    const t = computeSaleTotals([
      { quantity: 2, unitPrice: 100 },
      { quantity: 3, unitPrice: 50 },
    ]);
    expect(t.subtotal).toBe(350);
    expect(t.taxable).toBe(350);
    expect(t.total).toBe(350);
  });

  it("no discount, no GST → total equals subtotal", () => {
    const t = computeSaleTotals([{ quantity: 1, unitPrice: 1000 }]);
    expect(t).toEqual({ subtotal: 1000, discount: 0, taxable: 1000, gst: 0, total: 1000 });
  });

  it("discount reduces taxable amount", () => {
    const t = computeSaleTotals([{ quantity: 1, unitPrice: 1000 }], { discount: 200 });
    expect(t.taxable).toBe(800);
    expect(t.total).toBe(800);
  });

  it("discount cannot exceed subtotal (capped)", () => {
    const t = computeSaleTotals([{ quantity: 1, unitPrice: 500 }], { discount: 9999 });
    expect(t.discount).toBe(500);
    expect(t.taxable).toBe(0);
    expect(t.total).toBe(0);
  });

  it("negative discount is clamped to zero", () => {
    const t = computeSaleTotals([{ quantity: 1, unitPrice: 500 }], { discount: -100 });
    expect(t.discount).toBe(0);
    expect(t.taxable).toBe(500);
  });

  it("GST is applied on taxable (post-discount), not subtotal", () => {
    const t = computeSaleTotals(
      [{ quantity: 1, unitPrice: 1000 }],
      { discount: 100, gstRate: 18 },
    );
    expect(t.taxable).toBe(900);
    expect(t.gst).toBe(162); // 18% of 900
    expect(t.total).toBe(1062);
  });

  it("GST rounds to 2 decimal places", () => {
    const t = computeSaleTotals(
      [{ quantity: 3, unitPrice: 33.33 }],
      { gstRate: 5 },
    );
    expect(t.subtotal).toBe(99.99);
    expect(t.gst).toBe(5); // 5% of 99.99 = 4.9995 → round → 5.00
    expect(t.total).toBe(104.99);
  });

  it("zero GST rate → gst is zero even with non-zero taxable", () => {
    const t = computeSaleTotals(
      [{ quantity: 1, unitPrice: 500 }],
      { discount: 50, gstRate: 0 },
    );
    expect(t.gst).toBe(0);
    expect(t.total).toBe(450);
  });

  it("empty items → all zeros", () => {
    const t = computeSaleTotals([]);
    expect(t).toEqual({ subtotal: 0, discount: 0, taxable: 0, gst: 0, total: 0 });
  });
});
