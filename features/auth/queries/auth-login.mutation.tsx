"use client";

import { signIn } from "@/lib/auth";
import { handleServerActionError } from "@/utils/handleServerActionError";
import { addToast } from "@heroui/toast";
import { useMutation } from "@tanstack/react-query";
import { processAndValidateFormData } from "ak-zod-form-kit";
import { CheckCircle2, X } from "lucide-react";
import { authAPI } from "../apis/auth.api";
import { LoginDTO, loginSchema } from "../schemas/auth.schema";
import { useInvalidateAuthQuery } from "./index.query";

export const useLoginMutation = () => {
  const invalidateAuthQuery = useInvalidateAuthQuery();

  return useMutation({
    mutationFn: async ({ data }: { data: LoginDTO }) => {
      // Validation des données
      const validation = processAndValidateFormData(loginSchema, data, {
        outputFormat: "object",
        transformations: {
          email: (value: string) => value.trim().toLowerCase(),
          password: (value: string) => value.trim(),
        },
      });

      if (!validation.success) {
        throw new Error(
          validation.errorsInString ||
          "Une erreur est survenue lors de la validation des données."
        );
      }

      try {
        await signIn("credentials", {
          ...validation.data,
          redirect: false,
        });
      } catch (error) {
        try {
          await authAPI.login(validation.data as LoginDTO);

          await signIn("credentials", {
            ...validation.data,
            redirect: false,
          });
        } catch (error) {
          return handleServerActionError(error, "Erreur lors de la connexion");
        }
      }
    },
    onSuccess: async () => {
      addToast({
        title: "Connexion reussie",
        description: "Connexion reussie",
        icon: <CheckCircle2 />,
        promise: invalidateAuthQuery(),
        color: "success",
      });
    },

    onError: async (error:Error) => {
      addToast({
        title: "Erreur lors de la connexion:",
        description: error.message,
        icon: <X />,
        promise: Promise.reject(error),
        color: "danger",
      });
    },
  });
};
