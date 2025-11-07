import { z } from "zod";

export const CreateVillesSchema = z.object({
  // --- Informations principales ---
  name: z
    .string({ message: "Le nom de la ville est requis" })
    .min(2, "Le nom de la ville doit contenir au moins 2 caractères")
    .max(100, "Le nom de la ville ne doit pas dépasser 100 caractères")
    .trim(),

  countryCode: z
    .string({ message: "Le code du pays est requis" })
    .min(1, "Le code du pays ne peut pas être vide")
    .max(10, "Le code du pays ne doit pas dépasser 10 caractères")
    .trim(),

  // --- Communes associées ---
 communes: z
  .union([z.string().optional(), z.array(z.string()).optional()])
  .transform((val) =>
    typeof val === "string" ? val.split(",").map(c => c.trim()).filter(Boolean) : val || []
  )
  .default([])
,
});

// --- Types dérivés ---
export type CreateVillesDTO = z.infer<typeof CreateVillesSchema>;

// --- Pour la mise à jour ---
export const UpdateVillesSchema = CreateVillesSchema.partial();
export type UpdateVillesDTO = z.infer<typeof UpdateVillesSchema>;
