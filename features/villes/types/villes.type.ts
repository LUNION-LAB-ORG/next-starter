// ✅ ville.type.ts

// --- Interface principale ---
export interface IVilles {
  id: string;

  // --- Informations principales ---
  name: string; // Nom de la ville
  countryCode: string; // Code du pays (ex : "CI", "FR", "US")

  // --- Communes associées ---
  communes?: string[]; // Liste des communes rattachées à la ville

  // --- Métadonnées ---
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

// --- Interface pour la création / mise à jour ---
export interface IVillesCreateUpdate {
  name: string;
  countryCode: string;
  communes?: string[];
}

// --- Interface pour filtrage / requêtes ---
export interface IVillesParams {
  name?: string;
  countryCode?: string;
  page?: number;
  limit?: number;
}

// --- Réponse de création / mise à jour ---
export interface IVillesAddUpdateResponse
  extends Pick<
    IVilles,
    "id" | "name" | "countryCode" | "communes" | "createdAt" | "updatedAt" | "deletedAt"
  > {}

// --- Réponse de suppression ---
export interface IVillesDeleteResponse {
  success: true;
  message: string;
}
export interface IVillesDeleteErrorResponse {
  success: false;
  error: string;
}