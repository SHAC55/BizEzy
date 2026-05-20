// Canonical sale totals formula. Mobile (app/src/pages/AddSalePage.tsx) and
// web (client/src/pages/AddTransaction.jsx) compute the same numbers for the
// live preview; this is the server-side reference. Keep all three in sync.
//
// Formula:
//   subtotal = sum(quantity * unitPrice) over items
//   discount = min(requestedDiscount, subtotal)    // discount cannot exceed subtotal
//   taxable  = max(subtotal - discount, 0)
//   gst      = round2(taxable * gstRate / 100)
//   total    = round2(taxable + gst)
//
// All amounts are stored to 2 decimal places (paise/cents).

export type SaleLineInput = {
  quantity: number;
  unitPrice: number;
};

export type SaleTotals = {
  subtotal: number;
  discount: number;
  taxable: number;
  gst: number;
  total: number;
};

const round2 = (value: number) => Math.round(value * 100) / 100;

export const computeSaleTotals = (
  items: SaleLineInput[],
  options: { discount?: number; gstRate?: number } = {},
): SaleTotals => {
  const subtotal = round2(
    items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0),
  );
  const discount = Math.min(Math.max(options.discount ?? 0, 0), subtotal);
  const taxable = Math.max(round2(subtotal - discount), 0);
  const gstRate = Math.max(options.gstRate ?? 0, 0);
  const gst = round2((taxable * gstRate) / 100);
  const total = round2(taxable + gst);
  return { subtotal, discount, taxable, gst, total };
};
