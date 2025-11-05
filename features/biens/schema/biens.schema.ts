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
  // --- Informations principales ---
  title: z
    .string({ message: "Le titre est requis" })
    .min(2, "Le titre doit contenir au moins 2 caractères")
    .max(100, "Le titre ne doit pas dépasser 100 caractères")
    .trim(),

  description: z
    .string()
    .min(2, "La description doit contenir au moins 2 caractères")
    .max(1000, "La description ne doit pas dépasser 1000 caractères")
    .optional(),

  coupDeCoeur: z.coerce.boolean().optional().default(false),

  // --- Informations de vente/location ---
  listingType: ListingTypeEnum,
  currency: CurrencyEnum.optional(),

  price: z.string({ message: "Le prix est requis" }),
  secondaryPrice: z.string().optional(),

  pricePeriod: PricePeriodEnum.optional(),

  // --- Dimensions ---
  area: z.string().optional(),

  landArea: z.string().optional(),

  rooms: z.coerce.number().min(0).optional(),
  bedrooms: z.coerce.number().min(0).optional(),
  bathrooms: z.coerce.number().min(0).optional(),
  garages: z.coerce.number().min(0).optional(),
  garageCapacity: z.coerce.number().min(0).optional(),
  yearBuilt: z.coerce.number().min(0).optional(),

  // --- Localisation ---
  cityId: z.string({ message: "La ville est requise" }).min(1),
  communeId: z.string().optional(),
  areaId: z.string().optional(),
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),

  latitude: z.string().optional(),

  longitude: z.string().optional(),

  categoryId: z.string(),

  // --- Commodités ---
  amenities: z.array(z.string().min(1).max(100)).optional().default([]),

  // --- Statut ---
  status: BiensStatusEnum.optional().default("DRAFT").optional(),

  // --- Médias ---
  images: z.array(z.instanceof(File)).min(1, "Au moins une image est requise"),
  video: z.instanceof(File).optional(),
});

export type BiensAddDTO = z.infer<typeof BiensAddSchema>;

// Pour la mise à jour (tous les champs optionnels)
export const BiensUpdateSchema = BiensAddSchema.partial();
export type BiensUpdateDTO = z.infer<typeof BiensUpdateSchema>;
