import { z } from "zod";

// --- Schéma pour créer une catégorie de propriété ---
export const CreateCategorySchema = z.object({
  label: z
    .string({ message: "Le label de la catégorie est requis" })
    .min(2, "Le label doit contenir au moins 2 caractères")
    .max(100, "Le label ne doit pas dépasser 100 caractères")
    .trim(),

  parentId: z
    .string({ message: "L'ID du parent doit être une chaîne de caractères" })
    .optional()
    
});

// --- Type dérivé pour la création ---
export type CreateCategoryDTO = z.infer<typeof CreateCategorySchema>;

// --- Schéma pour la mise à jour (partiel) ---
export const UpdatePropertyCategorySchema = CreateCategorySchema.partial();
export type UpdatePropertyCategoryDTO = z.infer<typeof UpdatePropertyCategorySchema>;
