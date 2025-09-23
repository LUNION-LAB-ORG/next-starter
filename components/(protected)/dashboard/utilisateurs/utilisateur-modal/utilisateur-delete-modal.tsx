"use client";

import { useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IUtilisateur } from "../../types/utilisateur.type";
import { useSupprimerUtilisateurMutation } from "../../queries/utilisateur.mutation";
import { Button } from "@/components/ui/button";

type Props = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  utilisateur: IUtilisateur | null;
};

export function UtilisateurDeleteModal({
  isOpen,
  setIsOpen,
  utilisateur,
}: Props) {
  const { mutateAsync: supprimerUtilisateurMutation, isPending } =
    useSupprimerUtilisateurMutation();

  const handleClose = useCallback(() => {
    if (!isPending) {
      setIsOpen(false);
    }
  }, [isPending, setIsOpen]);
  const handleDelete = useCallback(async () => {
    await supprimerUtilisateurMutation({ id: utilisateur?.id || "" });
    handleClose();
  }, [supprimerUtilisateurMutation, handleClose, utilisateur]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-medium text-gray-900">
            {`Supprimer ${utilisateur?.firstName} ${utilisateur?.lastName} ?`}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cet utilisateur
            sera banni de l&apos;application.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isPending}
            className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            Annuler
          </Button>
          {/* Bouton Supprimer */}
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
            className="px-4 py-2 text-sm text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50"
          >
            {isPending ? "Suppression..." : "Supprimer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
