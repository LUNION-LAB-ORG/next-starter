import React from "react";

import getQueryClient from "@/lib/get-query-client";
import { addToast } from "@heroui/toast";
import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import { obtenirTousAmenitiesAction } from "../actions/biens.action";
import { biensKeyQuery } from "./index.query";

const queryClient = getQueryClient();

//1- Option de requête optimisée
export const amenitiesListQueryOption = () => {
  return {
    queryKey: biensKeyQuery("amenities"),
    queryFn: async () => {
      const result = await obtenirTousAmenitiesAction();
      if (!result.success) {
        throw new Error(
          result.error || "Erreur lors de la récupération des commodités"
        );
      }
      return result.data!;
    },
    placeholderData: (previousData: any) => previousData,
    staleTime: 5 * 60 * 1000, // 5 minutes (les commodités changent rarement)
    refetchOnWindowFocus: false,
    refetchOnMount: false, // Pas besoin de refetch à chaque mount
  };
};

//2- Hook pour récupérer les commodités
export const useAmenitiesListQuery = () => {
  const query = useQuery(amenitiesListQueryOption());

  // Gestion des erreurs dans le hook
  React.useEffect(() => {
    if (query.isError && query.error) {
      addToast({
        title: "Erreur lors de la récupération des commodités:",
        description:
          query.error instanceof Error
            ? query.error.message
            : "Erreur inconnue",
        icon: <X />,
        color: "danger",
      });
    }
  }, [query.isError, query.error]);

  return query;
};

//3- Fonction pour précharger les commodités appelée dans les pages
export const prefetchAmenitiesListQuery = () => {
  return queryClient.prefetchQuery(amenitiesListQueryOption());
};
