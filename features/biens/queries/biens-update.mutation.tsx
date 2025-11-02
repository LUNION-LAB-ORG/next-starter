"use client";

import { addToast } from "@heroui/toast";
import { useMutation } from "@tanstack/react-query";
import { processAndValidateFormData } from "ak-zod-form-kit";
import { CheckCircle2, X } from "lucide-react";
import { modifierBiensAction } from "../actions/biens.action";
import { BiensUpdateDTO, BiensUpdateSchema } from "../schema/biens.schema";
import { useInvalidateBiensQuery } from "./index.query";

export const useModifierBiensMutation = () => {
  const invalidateBiensrQuery = useInvalidateBiensQuery();
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: BiensUpdateDTO;
    }) => {
      // Validation des données
      const validation = processAndValidateFormData(
        BiensUpdateSchema,
        data,
        {
          outputFormat: "object",
        }
      );
      if (!validation.success) {
        throw new Error(
          validation.errorsInString ||
            "Une erreur est survenue lors de la validation des données."
        );
      }

      const result = await modifierBiensAction(
        id,
        validation.data as BiensUpdateDTO
      );

      if (!result.success) {
        throw new Error(
          result.error || "Erreur lors de la modification du bien"
        );
      }

      return result.data!;
    },
    onSuccess: async () => {
      addToast({
        title: "Bien modifié avec succès",
        description: "Bien modifié avec succès",
        promise: invalidateBiensrQuery(),
        icon: <CheckCircle2 />,
        color: "success",
      });
    },
    onError: async (error) => {
      addToast({
        title: "Erreur modification utilisateur:",
        description: error.message,
        promise: Promise.reject(error),
        icon: <X />,
        color: "danger",
      });
    },
  });
};
