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
  secondaryPrice: z.string().optional(),

  pricePeriod: PricePeriodEnum.optional(),
  area: z.string().optional(),

  landArea: z.string().optional(),

  rooms: z.number().min(0).optional(),
  bedrooms: z.number().min(0).optional(),
  bathrooms: z.number().min(0).optional(),
  garages: z.number().min(0).optional(),
  garageCapacity: z.number().min(0).optional(),
  yearBuilt: z.number().min(0).optional(),

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

export type BiensAddDTO = z.input<typeof BiensAddSchema>;

export const BiensUpdateSchema = BiensAddSchema.partial();
export type BiensUpdateDTO = z.infer<typeof BiensUpdateSchema>;
