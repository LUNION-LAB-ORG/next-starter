import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Button } from "@heroui/react";
import { toast } from "sonner";
import { CheckCircle2, X } from "lucide-react";
import { CreateCategoryDTO, CreateCategorySchema } from "@/features/categorie/schema/categorie.schema";
import { useAjouterCategoryMutation } from "@/features/categorie/queries/category-add.mutation";

interface CategorieModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  refetchCategories?: () => void; // facultatif : pour rafraîchir la liste
}

export const CategorieModal: React.FC<CategorieModalProps> = ({
  isOpen,
  setIsOpen,
  refetchCategories,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<CreateCategoryDTO>({
    resolver: zodResolver(CreateCategorySchema),
    mode: "onChange",
    defaultValues: {
      label: "",
      parentId: "",
    },
  });

  const { mutateAsync: categoryCreateMutation, isPending: categoryCreatePending } =
    useAjouterCategoryMutation();

  const onSubmitCategory = useCallback(
    async (data: CreateCategoryDTO) => {
      try {
        await categoryCreateMutation(data);
        toast.success(`Catégorie "${data.label}" ajoutée avec succès !`, {
          icon: <CheckCircle2 className="text-green-500" />,
        });
        reset();
        setIsOpen(false);
        refetchCategories?.();
      } catch (error: any) {
        toast.error(error?.message || "Impossible d’ajouter la catégorie.", {
          icon: <X className="text-red-500" />,
        });
      }
    },
    [categoryCreateMutation, reset, setIsOpen, refetchCategories]
  );

  return (
    <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmitCategory)}>
          <ModalHeader>Ajouter une Catégorie</ModalHeader>
          <ModalBody className="space-y-3">
            <Input
              label="Label"
              placeholder="Ex: Villa"
              {...register("label")}
              isInvalid={!!errors.label}
              errorMessage={errors.label?.message}
            />
            <Input
              label="Parent ID (optionnel)"
              placeholder="Ex: cmhhll3kn00..."
              {...register("parentId")}
              isInvalid={!!errors.parentId}
              errorMessage={errors.parentId?.message}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={() => setIsOpen(false)}>
              Annuler
            </Button>
            <Button
              color="primary"
              type="submit"
              disabled={!isValid}
              isLoading={categoryCreatePending}
            >
              Enregistrer
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};
