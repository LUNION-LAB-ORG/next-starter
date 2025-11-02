import React from "react";

import getQueryClient from "@/lib/get-query-client";
import { addToast } from "@heroui/toast";
import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import { obtenirTousBiensAction } from "../actions/biens.action";
import { IBiensParams } from "../types/biens.type";
import { biensKeyQuery } from "./index.query";

const queryClient = getQueryClient();

//1- Option de requête optimisée
export const biensListQueryOption = (
  biensParamsDTO: IBiensParams
) => {
  return {
    queryKey: biensKeyQuery("list", biensParamsDTO),
    queryFn: async () => {
      const result = await obtenirTousBiensAction(biensParamsDTO);
      if (!result.success) {
        throw new Error(
          result.error || "Erreur lors de la récupération des Biens"
        );
      }
      return result.data!;
    },
    placeholderData: (previousData: any) => previousData,
    staleTime: 30 * 1000, //30 secondes
    refetchOnWindowFocus: false, //Ne pas refetch lors du focus de la fenetre
    refetchOnMount: true, //Refetch lors du mount
  };
};

//2- Hook pour récupérer les utilisateurs
export const useBiensListQuery = (
  biensParamsDTO: IBiensParams
) => {
  const query = useQuery(biensListQueryOption(biensParamsDTO));

  // Gestion des erreurs dans le hook
  React.useEffect(() => {
    if (query.isError && query.error) {
      addToast({
        title: "Erreur lors de la récupération des Biens:",
        description:
          query.error instanceof Error
            ? query.error.message
            : "Erreur inconnue",
        icon: <X />,
        color: "danger",
      });
    }
  }, [query]);

  return query;
};

//3- Fonction pour précharger les utilisateurs appelée dans les pages
export const prefetchBiensListQuery = (
  biensParamsDTO: IBiensParams
) => {
  return queryClient.prefetchQuery(
    biensListQueryOption(biensParamsDTO)
  );
};
