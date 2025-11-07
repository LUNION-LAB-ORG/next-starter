import React from "react";

import getQueryClient from "@/lib/get-query-client";
import { addToast } from "@heroui/toast";
import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import { obtenirTousCategoryAction } from "../actions/categorie.action";
import { ICategoryParams } from "../types/categorie.type";
import { categoryKeyQuery } from "./index.query";

const queryClient = getQueryClient();

//1- Option de requête optimisée
export const categoryListQueryOption = (
  categoryParamsDTO: ICategoryParams
) => {
  return {
    queryKey: categoryKeyQuery("list", categoryParamsDTO),
    queryFn: async () => {
      const result = await obtenirTousCategoryAction(categoryParamsDTO);
      if (!result.success) {
        throw new Error(
          result.error || "Erreur lors de la récupération des categories"
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
export const useCategoryListQuery = (
  categoryParamsDTO: ICategoryParams
) => {
  const query = useQuery(categoryListQueryOption(categoryParamsDTO));

  // Gestion des erreurs dans le hook
  React.useEffect(() => {
    if (query.isError && query.error) {
      addToast({
        title: "Erreur lors de la récupération des categories:",
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
export const prefetchCategoryListQuery = (
  categoryParamsDTO: ICategoryParams
) => {
  return queryClient.prefetchQuery(
    categoryListQueryOption(categoryParamsDTO)
  );
};
