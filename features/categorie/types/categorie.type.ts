// --- Interface principale ---
export interface ICategory {
  id: string;
  key: string;
  // --- Informations principales ---
  label: string;        // Nom de la catégorie
  parentId?: string;    // Catégorie parente (facultatif)

  // --- Métadonnées ---
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

// --- Interface pour la création / mise à jour ---
export interface ICategoryCreateUpdate {
  label: string;
  parentId?: string;
}

// --- Interface pour filtrage / requêtes ---
export interface ICategoryParams {
  label?: string;
  parentId?: string;
  page?: number;
  limit?: number;
}

// --- Réponse de création / mise à jour ---
export interface ICategoryAddUpdateResponse
  extends Pick<ICategory, 'id' | 'label' | 'parentId' | 'createdAt' | 'updatedAt' | 'deletedAt'> {}

// --- Réponse de suppression ---
export interface ICategoryDeleteResponse {
  success: true;
  message: string;
}
export interface ICategoryDeleteErrorResponse {
  success: false;
  error: string;
}
