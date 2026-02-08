"use client";

import { UtilisateurList } from "@/components/(protected)/dashboard/utilisateurs/utilisateur-list";
import { UtilisateurHeaderFilter } from "@/components/(protected)/dashboard/utilisateurs/utilisateur-list/utilisateur-header-filter";
import { utilisateurTableColumns } from "@/components/(protected)/dashboard/utilisateurs/utilisateur-list/utilisateur-table-columns";
import { UtilisateurAddModal } from "@/components/(protected)/dashboard/utilisateurs/utilisateur-modal/utilisateur-add-modal";
import { UtilisateurDeleteModal } from "@/components/(protected)/dashboard/utilisateurs/utilisateur-modal/utilisateur-delete-modal";
import { UtilisateurUpdateModal } from "@/components/(protected)/dashboard/utilisateurs/utilisateur-modal/utilisateur-update-modal";
import Content from "@/components/primitives/Content";
import { useUtilisateurListTable } from "@/features/utilisateur/hooks/useUtilisateurListTable";

export default function UtilisateursPage() {
  const {
    table,
    isLoading,
    isError,
    isFetching,
    handleTextFilterChange,
    handleEnumFilterChange,
    modalStates,
    modalHandlers,
    currentUser,
    filters,
  } = useUtilisateurListTable({ columns: utilisateurTableColumns });

  return (
    <Content>
      <UtilisateurHeaderFilter
        handleTextFilterChange={handleTextFilterChange}
        handleEnumFilterChange={handleEnumFilterChange}
        filters={filters}
        modalHandlers={modalHandlers}
      />
      <UtilisateurList table={table} isLoading={isLoading} isError={isError} isFetching={isFetching} />

      {/* Modales - décommentez quand prêtes */}
      <UtilisateurAddModal
        isOpen={modalStates.addOpen}
        setIsOpen={modalHandlers.setAddOpen}
      />

      {currentUser && (
        <>
          <UtilisateurUpdateModal
            isOpen={modalStates.editOpen}
            setIsOpen={modalHandlers.setEditOpen}
            utilisateur={currentUser}
          />
          <UtilisateurDeleteModal
            isOpen={modalStates.deleteOpen}
            setIsOpen={modalHandlers.setDeleteOpen}
            utilisateur={currentUser}
          />
        </>
      )}
    </Content>
  );
}
