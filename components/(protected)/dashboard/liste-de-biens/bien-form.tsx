"use client";

import React from "react";
import { Spinner } from "@heroui/react";
import BiensTable from "@/components/(protected)/dashboard/liste-de-biens/biens-table";
import { useBiensListQuery } from "@/features/biens/queries/biens-list.query";
import { IBiens, IBiensParams } from "@/features/biens/types/biens.type";
import { BiensUpdateModal } from "../biens/biens-modal/biens-update-modal";
import { BiensDeleteModal } from "../biens/biens-modal/biens-delete-modal";

const BienForm = () => {
  const [selectedBien, setSelectedBien] = React.useState<IBiens | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);

  const [params] = React.useState<IBiensParams>({
    page: 1,
    limit: 20,
  });

  const { data, isLoading, isError, refetch } = useBiensListQuery(params);

  const handleEdit = (bien: IBiens) => {
    setSelectedBien(bien);
    setIsEditModalOpen(true);
  };

  const handleDelete = (bien: IBiens) => {
    setSelectedBien(bien);
    setIsDeleteModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-danger py-6">
        Une erreur est survenue lors du chargement des biens.
        <button onClick={() => refetch()} className="ml-3 text-primary underline">
          Réessayer
        </button>
      </div>
    );
  }

  if (!data || data.data.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        Aucun bien disponible.
      </div>
    );
  }

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

      <BiensTable
        data={data.data || []}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* ✏️ Modal de modification */}
      <BiensUpdateModal
        isOpen={isEditModalOpen}
        bien={selectedBien}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedBien(null);
          refetch();
        }}
      />

      {/* 🗑️ Modal de suppression */}
      <BiensDeleteModal
        isOpen={isDeleteModalOpen}
        bien={selectedBien}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedBien(null);
          refetch();
        }}
      />
    </div>
  );
};

export default BienForm;
