// ✅ biens.type.ts (corrigé et aligné avec ton schéma Zod)

import { ICategory } from "@/features/categorie/types/categorie.type";
import { IVille } from "@/features/villes/types/villes.type";

export enum ListingType {
  SALE = "SALE",
  RENT = "RENT"
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

export enum BienStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  ARCHIVED = "ARCHIVED",
  IN_PROGRESS = "IN_PROGRESS",
}

export interface IAmenity {
  id?: string;
  name: string;
}

export interface IPropertyMedia {
  id: string;
  kind: 'IMAGE' | 'VIDEO';
  key: string;
  width?: number;
  height?: number;
  createdAt: Date;
  url: string;
}

export interface IBien {
  id: string;
  title: string;
  slug?: string;
  description?: string;
  coupDeCoeur?: boolean;
  listingType: ListingType;
  currency?: Currency;
  price: string;
  secondaryPrice?: string;
  pricePeriod?: PricePeriod;
  area?: string;
  landArea?: string;
  rooms?: number;
  bedrooms?: number;
  bathrooms?: number;
  garages?: number;
  garageCapacity?: number;
  yearBuilt?: number;
  city: IVille;
  communeId?: string;
  areaId?: string;
  addressLine1?: string;
  addressLine2?: string;
  latitude?: string;
  longitude?: string;
  category?: ICategory;
  medias?: IPropertyMedia[];
  amenities?: IAmenity[];
  coverMedia?: IPropertyMedia; // URL de l'image de couverture
  coverMediaId?: string;
  images: string[]; // URLs des images uploadées
  video?: string; // URL ou identifiant de la vidéo
  status: BienStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface IBiensParams {
  title?: string;
  status?: BienStatus;
  listingType?: ListingType | null;
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
    IBien,
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
    | "city"
    | "communeId"
    | "areaId"
    | "addressLine1"
    | "addressLine2"
    | "latitude"
    | "longitude"
    | "category"
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
