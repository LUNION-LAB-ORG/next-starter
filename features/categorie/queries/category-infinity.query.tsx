import React from "react";

import getQueryClient from "@/lib/get-query-client";
import { PaginatedResponse } from "@/types/api.type";
import { addToast } from "@heroui/toast";
import { useInfiniteQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import { obtenirTousBiensAction } from "../actions/categorie.action";
import { IBiens, IBiensParams } from "../types/categorie.type";
import { biensKeyQuery } from "./index.query";

const queryClient = getQueryClient();

//1- Option de requête
export const biensInfinityQueryOption = (
  biensParamsDTO: IBiensParams
) => {
  return {
    queryKey: biensKeyQuery("list", biensParamsDTO),
    queryFn: async ({ pageParam = 1 }) => {
      const result = await obtenirTousBiensAction({
        ...biensParamsDTO,
        page: pageParam,
      });

      if (!result.success) {
        throw new Error(
          result.error || "Erreur lors de la récupération des biens"
        );
      }

      return result.data!;
    },

    initialPageParam: 1,

    getNextPageParam: (lastPage: PaginatedResponse<IBiens>) => {
      const hasNextPage = lastPage.meta.totalPages > lastPage.meta.page;
      return hasNextPage ? lastPage.meta.page + 1 : undefined;
    },
  };
};

//2- Hook pour récupérer les utilisateurs
export const useBiensInfinityQuery = (
  biensParamsDTO: IBiensParams
) => {
  const query = useInfiniteQuery(
    biensInfinityQueryOption(biensParamsDTO)
  );

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

//3- Fonction pour précharger les utilisateurs
export const prefetchBiensInfinityQuery = (
  biensParamsDTO: IBiensParams
) => {
  return queryClient.prefetchInfiniteQuery(
    biensInfinityQueryOption(biensParamsDTO)
  );
};
