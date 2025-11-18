import { parseAsString, parseAsInteger, parseAsStringEnum } from "nuqs";
import { ListingType } from "@/features/biens/types/biens.type";

/**
 * @constant biensFiltersClient
 * @description Définit les schémas de parsing pour les paramètres de requête d'URL
 * utilisés pour filtrer et paginer la liste des utilisateurs.
 * Chaque propriété correspond à un paramètre d'URL et spécifie son type
 * et sa valeur par défaut.
 */
export const biensFiltersClient = {
  filter: {
    page: parseAsInteger.withDefault(1),
    limit: parseAsInteger.withDefault(10),
    title: parseAsString.withDefault(""),
    cityId: parseAsString.withDefault(""),
    communeId: parseAsString.withDefault(""),
    categoryId: parseAsString.withDefault(""),
    listingType: parseAsStringEnum(Object.values(ListingType)),
  },
  option: {
    clearOnDefault: true,
    throttleMs: 500, // 500ms de délai pour les filtres textuels
  },
};
