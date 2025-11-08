// ✅ biens.type.ts (corrigé et aligné avec ton schéma Zod)

export enum ListingType {
  SALE = "SALE",
  RENT = "RENT",
  LEASE = "LEASE",
}

export enum Currency {
  XOF = "XOF",
  USD = "USD",
  EUR = "EUR",
}

export enum PricePeriod {
  DAY = "DAY",
  WEEK = "WEEK",
  MONTH = "MONTH",
  YEAR = "YEAR",
}

export enum BiensStatus {
  AVAILABLE = "AVAILABLE",
  SOLD = "SOLD",
  RENTED = "RENTED",
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
}

export interface IBiens {
  id: string;

  // --- Informations principales ---
  title: string;
  slug?: string;
  description?: string;
  coupDeCoeur?: boolean;

  // --- Informations de vente/location ---
  listingType: ListingType;
  currency?: Currency;
  price: string;
  secondaryPrice?: string;
  pricePeriod?: PricePeriod;

  // --- Dimensions ---
  area?: string;
  landArea?: string;
  rooms?: number;
  bedrooms?: number;
  bathrooms?: number;
  garages?: number;
  garageCapacity?: number;
  yearBuilt?: number;

  // --- Localisation ---
  cityId: string;
  communeId?: string;
  areaId?: string;
  addressLine1?: string;
  addressLine2?: string;
  latitude?: string;
  longitude?: string;
  categoryId?: string;
  media?: string[];
  // --- Commodités ---
  amenities?: string[];

  // --- Médias ---
  coverMediaId?: string;
  images: string[]; // URLs des images uploadées
  video?: string; // URL ou identifiant de la vidéo

  // --- Statut ---
  status: BiensStatus;

  // --- Métadonnées ---
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface IBiensParams {
  status?: BiensStatus;
  listingType?: ListingType;
  cityId?: string;
  communeId?: string;
  areaId?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  bedrooms?: number;
  bathrooms?: number;
  page?: number;
  limit?: number;
}

export interface IBiensAddUpdateResponse
  extends Pick<
    IBiens,
    | "id"
    | "title"
    | "slug"
    | "description"
    | "listingType"
    | "currency"
    | "price"
    | "secondaryPrice"
    | "pricePeriod"
    | "area"
    | "landArea"
    | "rooms"
    | "bedrooms"
    | "bathrooms"
    | "garages"
    | "garageCapacity"
    | "yearBuilt"
    | "cityId"
    | "communeId"
    | "areaId"
    | "addressLine1"
    | "addressLine2"
    | "latitude"
    | "longitude"
    | "categoryId"
    | "amenities"
    | "coverMediaId"
    | "status"
    | "images"
    | "video"
    | "createdAt"
    | "updatedAt"
    | "deletedAt"
  > {}

export interface IBiensDeleteResponse {
  success: true;
  message: string;
}
