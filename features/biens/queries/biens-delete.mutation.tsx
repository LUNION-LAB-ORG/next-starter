"use client";

import { addToast } from "@heroui/toast";
import {
    useMutation,
} from '@tanstack/react-query';
import { CheckCircle2, X } from "lucide-react";
import { useInvalidateBiensQuery } from './index.query';
import { supprimerBiensAction } from "../actions/biens.action";

export const useSupprimerBiensMutation = () => {
    const invalidateUtilisateurQuery = useInvalidateBiensQuery()
    return useMutation({
        mutationFn: async ({ id }: { id: string }) => {
            if (!id) {
                throw new Error("L'identifiant du bien est requis.");
            }
            const result = await supprimerBiensAction(id)
            if (!result.success) {
                throw new Error(result.error || "Erreur lors de la suppression du biens");
            }
            return result.data!;
        },
        onSuccess: async () => {
            addToast({
                title: "Bien supprimé avec succès",
                description: "Bien supprimé avec succès",
                promise: invalidateUtilisateurQuery(),
                icon: <CheckCircle2 />,
                color: "success",
            });
        },
        onError: async (error) => {
            addToast({
                title: "Erreur suppression du  bien:",
                description: error.message,
                promise: Promise.reject(error),
                icon: <X />,
                color: "danger",
            });
        },
    });
};