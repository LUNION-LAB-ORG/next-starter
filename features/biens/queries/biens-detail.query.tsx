import React from "react";

import getQueryClient from "@/lib/get-query-client";
import { addToast } from "@heroui/toast";
import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import { obtenirUnBiensAction } from "../actions/biens.action";
import { biensKeyQuery } from "./index.query";

const queryClient = getQueryClient();

//1- Option de requête
export const biensQueryOption = (id?: string) => {
  return {
    queryKey: biensKeyQuery("detail", id),
    queryFn: async () => {
      if (!id) throw new Error("L'identifiant du biens est requis");

      const result = await obtenirUnBiensAction(id);

      if (!result.success) {
        throw new Error(result.error);
      }

      return result.data;
    },
    enabled: !!id,
  };
};

//2- Hook pour récupérer un utilisateur
export const useBienDetailsQuery = (id?: string) => {
  const query = useQuery(biensQueryOption(id));

  // Gestion des erreurs dans le hook
  React.useEffect(() => {
    if (query.isError && query.error) {
      addToast({
        title: "Erreur lors de la récupération du bien:",
        description: query.error.message,
        icon: <X />,
        color: "danger",
      });
    }
  }, [query.isError, query.error]);

  return query;
};

//3- Fonction pour précharger un utilisateur
export const prefetchBienDetailQuery = (id: string) => {
  if (!id) {
    return Promise.resolve();
  }
  return queryClient.prefetchQuery(biensQueryOption(id));
};