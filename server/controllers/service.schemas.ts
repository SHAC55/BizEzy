import z from "zod";

export const createServiceSchema = z.object({
  name: z.string().trim().min(1).max(255),
  code: z
    .string()
    .trim()
    .min(1)
    .max(100)
    .optional()
    .transform((value) => value || undefined),
  costPrice: z.number().nonnegative(),
  price: z.number().nonnegative(),
});

export const updateServiceSchema = z
  .object({
    name: z.string().trim().min(1).max(255).optional(),
    code: z
      .string()
      .trim()
      .min(1)
      .max(100)
      .nullable()
      .optional()
      .transform((value) => (value === null ? null : value || undefined)),
    costPrice: z.number().nonnegative().optional(),
    price: z.number().nonnegative().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "at least one field is required",
  });

export const getServicesQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
  search: z
    .string()
    .trim()
    .max(255)
    .optional()
    .transform((value) => value || undefined),
});
