import { z } from "zod";

export const ListingTypeEnum = z.enum(["SALE", "RENT", "LEASE"]);
export const CurrencyEnum = z.enum(["XOF", "USD", "EUR"]);
export const PricePeriodEnum = z.enum(["DAY", "WEEK", "MONTH", "YEAR"]);
export const BiensStatusEnum = z.enum([
  "AVAILABLE",
  "SOLD",
  "RENTED",
  "PENDING",
]);

export const BiensAddSchema = z.object({
  title: z
    .string({ message: "Le titre est requis" })
    .min(2, "Le titre doit contenir au moins 2 caractères")
    .max(100, "Le titre ne doit pas dépasser 100 caractères")
    .trim(),

  slug: z.string().optional(),

  description: z
    .string()
    .min(2, "La description doit contenir au moins 2 caractères")
    .max(1000, "La description ne doit pas dépasser 1000 caractères")
    .optional(),

  listingType: ListingTypeEnum,
  currency: CurrencyEnum.optional(),

  price: z.number().min(0, "Le prix doit être positif"),
  secondaryPrice: z.coerce
    .number()
    .min(0, "Le prix secondaire doit être positif")
    .optional(),
  pricePeriod: PricePeriodEnum.optional(),

  area: z.number().min(0).optional(),
  landArea: z.number().min(0).optional(),
  rooms: z.number().min(0).optional(),
  bedrooms: z.number().min(0).optional(),
  bathrooms: z.number().min(0).optional(),
  garages: z.number().min(0).optional(),
  garageCapacity: z.number().min(0).optional(),
  yearBuilt: z.number().min(0).optional(),

  cityId: z.string({ message: "La ville est requise" }).min(1),
  communeId: z.string().optional(),
  areaId: z.string().optional(),
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),

  latitude: z.number().optional(),
  longitude: z.number().optional(),

  categoryId: z.string().optional(),

  // Transforme une chaîne "Piscine, Garage" → ["Piscine", "Garage"]
  amenities: z.array(z.string().min(1).max(100)).optional(),

  coverMediaId: z.instanceof(File).optional(),
  statut: BiensStatusEnum.optional(),
  
  images: z.array(z.instanceof(File)).min(1, "Au moins une image est requise"),

 video: z.instanceof(File).optional(),
});

export type BiensAddDTO = z.infer<typeof BiensAddSchema>;

// Pour la mise à jour (tous les champs optionnels)
export const BiensUpdateSchema = BiensAddSchema.partial();
export type BiensUpdateDTO = z.infer<typeof BiensUpdateSchema>;
