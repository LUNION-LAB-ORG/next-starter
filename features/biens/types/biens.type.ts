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
}

export interface IBiens {
  id: string;
  title: string;
  slug?: string;
  description?: string;
  listingType: ListingType;
  currency?: Currency;
  price: number;
  secondaryPrice?: number;
  pricePeriod?: PricePeriod;
  area?: number;
  landArea?: number;
  rooms?: number;
  bedrooms?: number;
  bathrooms?: number;
  garages?: number;
  garageCapacity?: number;
  yearBuilt?: number;
  cityId: string;
  communeId?: string;
  areaId?: string;
  addressLine1?: string;
  addressLine2?: string;
  latitude?: number;
  longitude?: number;
  categoryId?: string;
  amenities?: string[];
  coverMediaId?: string;
  statut?: BiensStatus;
  images: string[];
  video: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface IBiensParams {
  statut?: BiensStatus;
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

export interface IBiensAddUpdateResponse extends Pick<
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
  | "statut"
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
