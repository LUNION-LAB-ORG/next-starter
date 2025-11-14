import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button, Input } from "@heroui/react";

function VilleModal({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader>Ajouter une nouvelle ville</ModalHeader>
        <form>
          <ModalBody className="space-y-3 grid grid-cols-2 gap-4">
            <Input label="Nom de la ville" placeholder="Ex: Abidjan" />

            <Input label="Code du pays" placeholder="Ex: CI" />
          </ModalBody>
          <ModalFooter>
            <Button variant="light">Annuler</Button>
            <Button color="primary" type="submit">
              Enregistrer
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}

export default VilleModal;
