import { z } from "zod";

export const ListingTypeEnum = z.enum(["SALE", "RENT"]);
export const CurrencyEnum = z.enum(["XOF", "USD", "EUR"]);
export const PricePeriodEnum = z.enum(["DAY", "WEEK", "MONTH", "YEAR"]);
export const BiensStatusEnum = z.enum([
  "DRAFT",
  "PUBLISHED",
  "ARCHIVED",
  "IN_PROGRESS",
]);

const numericField = z
  .union([z.string(), z.number()])
  .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Doit être un nombre valide supérieur ou égal à 0",
  })
  // .transform((val) => Number(val))
  .optional();

export const BiensAddSchema = z.object({
  title: z
    .string({ message: "Le titre est requis" })
    .min(2, {
      error: "Le titre doit contenir au moins 2 caractères",
    })
    .max(100, {
      error: "Le titre ne doit pas dépasser 100 caractères",
    })
    .trim(),

  description: z.string().optional(),

  coupDeCoeur: z.boolean().default(false),

  listingType: ListingTypeEnum,
  currency: CurrencyEnum.optional(),

  price: z.string({ message: "Le prix est requis" }),
  secondaryPrice: numericField.default(0),

  pricePeriod: PricePeriodEnum.optional(),
  area: numericField,

  landArea: numericField,

  rooms: numericField,
  bedrooms: numericField,
  bathrooms: numericField,
  garages: numericField,
  garageCapacity: numericField,
  yearBuilt: numericField,

  // --- Localisation ---
  cityId: z.string({ error: "La ville est requise" }).min(1, {
    error: "La ville est requise",
  }),
  communeId: z.string().optional(),
  areaId: z.string().optional(),
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),

  latLong: z
    .object({
      lat: z.number().optional(),
      lng: z.number().optional(),
    })
    .optional(),

  categoryId: z.string({ error: "La catégorie est requise" }).min(1, {
    error: "La catégorie est requise",
  }),

  amenities: z
    .array(
      z.object({
        id: z.string().optional(),
        name: z.string(),
      }),
    )
    .default([]),

  images: z.array(z.instanceof(File)).min(1, "Au moins une image est requise"),
  video: z.instanceof(File).optional(),
  coverImage: z.instanceof(File, {
    error: "L'image de couverture est requise",
  }),
});
export const BienUpdateSchema = BiensAddSchema.partial();

export type BienAddDTO = z.input<typeof BiensAddSchema>;
export type BienUpdateDTO = z.infer<typeof BienUpdateSchema>;
