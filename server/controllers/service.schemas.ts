import z from "zod";

const trimmedOptional = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((value) => (value && value.length > 0 ? value : undefined));

export const createServiceSchema = z.object({
  name: z.string().trim().min(1).max(255),
  code: z
    .string()
    .trim()
    .min(1)
    .max(100)
    .optional()
    .transform((value) => value || undefined),
  description: trimmedOptional(2000),
  category: trimmedOptional(100),
  costPrice: z.number().nonnegative(),
  price: z.number().nonnegative(),
  durationMinutes: z.number().int().nonnegative().max(24 * 60).optional(),
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
    description: z
      .string()
      .trim()
      .max(2000)
      .nullable()
      .optional()
      .transform((value) => (value === null ? null : value || undefined)),
    category: z
      .string()
      .trim()
      .max(100)
      .nullable()
      .optional()
      .transform((value) => (value === null ? null : value || undefined)),
    costPrice: z.number().nonnegative().optional(),
    price: z.number().nonnegative().optional(),
    durationMinutes: z
      .number()
      .int()
      .nonnegative()
      .max(24 * 60)
      .nullable()
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "at least one field is required",
  });

export const getServicesQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
  category: z
    .string()
    .trim()
    .max(100)
    .optional()
    .transform((value) => value || undefined),
  search: z
    .string()
    .trim()
    .max(255)
    .optional()
    .transform((value) => value || undefined),
});
