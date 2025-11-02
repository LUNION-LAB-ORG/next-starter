import { z } from 'zod';


export const TypeBienEnum = z.enum(["TERRAIN", "MAISON", "VILLA"]);
export const VeriteEnum = z.enum(["true", "MOYENNE", "HAUTE"]);
// Schema pour l'ajout d'un utilisateur
export const BiensAddSchema = z.object({
  title: z.string({ message: "Le titre est requis" })
    .min(2, "Le titre doit contenir au moins 2 caractères")
    .max(100, "Le titre ne doit pas dépasser 100 caractères")
    .trim(),

  description: z.string({ message: "La description est requis" })
    .min(2, "La description doit contenir au moins 2 caractères")
    .max(100, "La descriptionne doit pas dépasser 100 caractères")
    .trim(),
     video: z.string({ message: "La video est requis" })
    .min(2, "La video doit contenir au moins 2 caractères")
    .max(100, "La video ne doit pas dépasser 100 caractères")
    .trim(),
     images: z.string({ message: "l'image est requis" })
    .min(2, "l'image doit contenir au moins 2 caractères")
    .max(100000, "l'image ne doit pas dépasser 100 caractères")
    .trim(),
     bgImage: z.string({ message: "l'image est requis" })
    .min(2, "l'image doit contenir au moins 2 caractères")
    .max(100000, "l'image ne doit pas dépasser 100 caractères")
    .trim(),
     superficie: z.string({ message: "La superficie est requise" })
    .min(2, "La superficie doit contenir au moins 2 caractères")
    .max(100, "La superficie ne doit pas dépasser 100 caractères")
    .trim(),
     nombreDeChambre: z.string({ message: "La description est requis" })
    .min(2, "La description doit contenir au moins 2 caractères")
    .max(100, "La descriptionne doit pas dépasser 100 caractères")
    .trim(),
     nombreDeSalleDeBain: z.string({ message: "La description est requis" })
    .min(2, "La description doit contenir au moins 2 caractères")
    .max(100, "La descriptionne doit pas dépasser 100 caractères")
    .trim(),
     nombreDeSalon: z.string({ message: "La description est requis" })
    .min(2, "La description doit contenir au moins 2 caractères")
    .max(100, "La descriptionne doit pas dépasser 100 caractères")
    .trim(),
     disponibilité: z.string({ message: "La description est requis" })
    .min(2, "La description doit contenir au moins 2 caractères")
    .max(100, "La descriptionne doit pas dépasser 100 caractères")
    .trim(),
     localisation: z.string({ message: "La description est requis" })
    .min(2, "La description doit contenir au moins 2 caractères")
    .max(100, "La descriptionne doit pas dépasser 100 caractères")
    .trim(),
     detailsExterieur: z.string({ message: "La description est requis" })
    .min(2, "La description doit contenir au moins 2 caractères")
    .max(100, "La descriptionne doit pas dépasser 100 caractères")
    .trim(),
     detailsInterieur: z.string({ message: "La description est requis" })
    .min(2, "La description doit contenir au moins 2 caractères")
    .max(100, "La descriptionne doit pas dépasser 100 caractères")
    .trim(),
     detailsAutres: z.string({ message: "La description est requis" })
    .min(2, "La description doit contenir au moins 2 caractères")
    .max(100, "La descriptionne doit pas dépasser 100 caractères")
    .trim(),
     prix: z.string({ message: "La description est requis" })
    .min(2, "La description doit contenir au moins 2 caractères")
    .max(100, "La descriptionne doit pas dépasser 100 caractères")
    .trim(),
     coupDeCoeur: z.string({ message: "La description est requis" })
    .min(2, "La description doit contenir au moins 2 caractères")
    .max(100, "La descriptionne doit pas dépasser 100 caractères")
    .trim(),
     typeDeBien: z.string({ message: "La description est requis" })
    .min(2, "La description doit contenir au moins 2 caractères")
    .max(100, "La descriptionne doit pas dépasser 100 caractères")
    .trim(),
     statut: z.string({ message: "La description est requis" })
    .min(2, "La description doit contenir au moins 2 caractères")
    .max(100, "La descriptionne doit pas dépasser 100 caractères")
    .trim(),
    

  role: z.enum(['AGENT', 'CHEF_SERVICE', 'CONSUL', 'ADMIN'], { message: "Le rôle est requis" })
});

export type BiensAddDTO = z.infer<typeof BiensAddSchema>;


// Schema pour la modification d'un utilisateur
export const UtilisateurUpdateSchema = BiensAddSchema.partial();
export type UtilisateurUpdateDTO = z.infer<typeof UtilisateurUpdateSchema>;


// Schema pour la modification du role d'un utilisateur
export const UtilisateurRoleSchema = BiensAddSchema.pick({ role: true });
export type UtilisateurRoleDTO = z.infer<typeof UtilisateurRoleSchema>;