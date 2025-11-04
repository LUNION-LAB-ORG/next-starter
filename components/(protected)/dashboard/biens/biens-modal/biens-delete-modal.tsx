"use client";

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { useCallback } from "react";

import { useSupprimerUtilisateurMutation } from "@/features/utilisateur/queries/utilisateur-delete.mutation";
import { useSupprimerBiensMutation } from "@/features/biens/queries/biens-delete.mutation";
import { IBiens } from "@/features/biens/types/biens.type";

type Props = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  biens: IBiens | null;
};

export function BiensDeleteModal({ isOpen, setIsOpen, biens }: Props) {
  const { mutateAsync: supprimerBiensMutation, isPending } =
    useSupprimerBiensMutation();

  const handleClose = useCallback(() => {
    if (!isPending) {
      setIsOpen(false);
    }
  }, [isPending, setIsOpen]);

  const handleDelete = useCallback(async () => {
    await supprimerBiensMutation({ id: biens?.id || "" });
    handleClose();
  }, [supprimerBiensMutation, handleClose, biens]);

  return (
    <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h1 className="text-lg font-medium text-primary">
            {`Supprimer ${biens?.title}  ?`}
          </h1>
          <p className="text-sm text-gray-500">
            Êtes-vous sûr de vouloir supprimer ce bien ? Ce bien sera banni de
            l&apos;application.
          </p>
        </ModalHeader>
        <ModalBody />
        <ModalFooter>
          <Button
            color="danger"
            variant="light"
            onPress={handleClose}
            disabled={isPending}
          >
            Annuler
          </Button>
          <Button
            color="danger"
            onPress={handleDelete}
            isLoading={isPending}
            disabled={isPending}
          >
            Supprimer
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
