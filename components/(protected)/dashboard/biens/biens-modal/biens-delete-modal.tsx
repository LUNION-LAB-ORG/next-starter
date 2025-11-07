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

import { useSupprimerBiensMutation } from "@/features/biens/queries/biens-delete.mutation";
import { IBiens } from "@/features/biens/types/biens.type";

type Props = {
  isOpen: boolean;
  bien: IBiens | null;
  onClose: () => void;
};

export function BiensDeleteModal({ isOpen, bien, onClose }: Props) {
  const { mutateAsync: supprimerBiensMutation, isPending } =
    useSupprimerBiensMutation();

  const handleClose = useCallback(() => {
    if (!isPending) onClose();
  }, [isPending, onClose]);

  const handleDelete = useCallback(async () => {
    if (!bien?.id) return;
    await supprimerBiensMutation({ id: bien.id });
    handleClose();
  }, [supprimerBiensMutation, handleClose, bien]);

  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h1 className="text-lg font-medium text-primary">
            {`Supprimer ${bien?.title ?? "ce bien"} ?`}
          </h1>
          <p className="text-sm text-gray-500">
            Êtes-vous sûr de vouloir supprimer ce bien ? Cette action est
            irréversible.
          </p>
        </ModalHeader>
        <ModalBody />
        <ModalFooter>
          <Button
            color="default"
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
