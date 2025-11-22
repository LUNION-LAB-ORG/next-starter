"use client";

import { addToast } from "@heroui/toast";
import { useMutation } from "@tanstack/react-query";
import { processAndValidateFormData } from "ak-zod-form-kit";
import { CheckCircle2, X } from "lucide-react";
import { modifierBiensAction } from "../actions/biens.action";
import { BienUpdateDTO, BienUpdateSchema } from "../schema/biens.schema";
import { useInvalidateBiensQuery } from "./index.query";

export const useModifierBienMutation = () => {
  const invalidateBienQuery = useInvalidateBiensQuery();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: BienUpdateDTO }) => {
      // Supprimer les images qui ne sont pas de type File
      data.images?.filter((img) => img instanceof File);
      data.video = data.video instanceof File ? data.video : undefined;

      console.log("Modifier bien data:", data);

      const validation = processAndValidateFormData(BienUpdateSchema, data, {
        outputFormat: "formData",
      });

      if (!validation.success) {
        throw new Error(
          validation.errorsInString ||
            "Une erreur est survenue lors de la validation des données.",
        );
      }

      const result = await modifierBiensAction(id, validation.data);

      if (!result.success) {
        throw new Error(
          result.error || "Erreur lors de la modification du bien",
        );
      }

      return result.data!;
    },
    onSuccess: async () => {
      addToast({
        title: "Bien modifié avec succès",
        description: "Bien modifié avec succès",
        promise: invalidateBienQuery(),
        icon: <CheckCircle2 />,
        color: "success",
      });
    },
    onError: async (error) => {
      addToast({
        title: "Erreur modification du biens:",
        description: error.message,
        promise: Promise.reject(error),
        icon: <X />,
        color: "danger",
      });
    },
  });
};
