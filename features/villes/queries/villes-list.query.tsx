import React from "react";

import getQueryClient from "@/lib/get-query-client";
import { addToast } from "@heroui/toast";
import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import { obtenirTousVillesAction } from "../actions/villes.action";
import { IVillesParams } from "../types/villes.type";
import { villesKeyQuery } from "./index.query";

const queryClient = getQueryClient();

//1- Option de requête optimisée
export const villesListQueryOption = (
  villesParamsDTO: IVillesParams
) => {
  return {
    queryKey: villesKeyQuery("list", villesParamsDTO),
    queryFn: async () => {
      const result = await obtenirTousVillesAction(villesParamsDTO);
      if (!result.success) {
        throw new Error(
          result.error || "Erreur lors de la récupération des villes"
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
export const useVillesListQuery = (
  villesParamsDTO: IVillesParams
) => {
  const query = useQuery(villesListQueryOption(villesParamsDTO));

  // Gestion des erreurs dans le hook
  React.useEffect(() => {
    if (query.isError && query.error) {
      addToast({
        title: "Erreur lors de la récupération des villes:",
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
  villesParamsDTO: IVillesParams
) => {
  return queryClient.prefetchQuery(
    villesListQueryOption(villesParamsDTO)
  );
};
