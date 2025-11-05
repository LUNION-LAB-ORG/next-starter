"use client";

import React from "react";
import { Spinner } from "@heroui/react";
import BiensTable from "@/components/(protected)/dashboard/liste-de-biens/biens-table";

import type { IBiens, IBiensParams } from "@/features/biens/types/biens.type";
import { useBiensListQuery } from "@/features/biens/queries/biens-list.query";
import { useSupprimerBiensMutation } from "@/features/biens/queries/biens-delete.mutation";
import { useModifierBiensMutation } from "@/features/biens/queries/biens-update.mutation";

const BiensList = () => {
    const [selectedBien, setSelectedBien] = React.useState<IBiens | null>(null);
const [isModalOpen, setIsModalOpen] = React.useState(false);
  // ⚙️ Paramètres de requête (à ajuster selon ton backend)
  const [params] = React.useState<IBiensParams>({
    page: 1,
    limit: 20,
  });

  // 🔄 Récupération des biens via React Query
  const { data, isLoading, isError, refetch } = useBiensListQuery(params);
  const { mutate: supprimerBien, isPending: isDeleting } = useSupprimerBiensMutation();
  const {mutateAsync:modifierBien}=useModifierBiensMutation();
  // ✏️ Action de mise à jour
  const handleEdit = (bien: IBiens) => {
  setSelectedBien(bien);    // stocke le bien à modifier
  setIsModalOpen(true);      // ouvre le modal
};
  // 🗑️ Action de suppression
 const handleDelete = (id: string) => {
  if (!id) return;

  supprimerBien({ id });
};


  // 🌀 Affichage du chargement
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  // ⚠️ Affichage en cas d’erreur
  if (isError) {
    return (
      <div className="text-center text-danger py-6">
        Une erreur est survenue lors du chargement des biens.
        <button
          onClick={() => refetch()}
          className="ml-3 text-primary underline"
        >
          Réessayer
        </button>
      </div>
    );
  }

  // 📭 Aucun bien
  if (!data || data.data.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        Aucun bien disponible pour le moment.
      </div>
    );
  }

  // ✅ Affichage de la table
  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Liste des biens</h1>
        <button
          onClick={() => refetch()}
          className="px-3 py-2 text-sm bg-primary text-white rounded-lg"
        >
          Rafraîchir
        </button>
      </div>

      <BiensTable  data={data.data || []} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
};

export default BiensList;
