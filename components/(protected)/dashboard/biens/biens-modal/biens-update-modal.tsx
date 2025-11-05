"use client";

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
} from "@heroui/react";
import { useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { IBiens, ListingType, Currency, BiensStatus } from "@/features/biens/types/biens.type";
import { BiensUpdateSchema, BiensUpdateDTO } from "@/features/biens/schema/biens.schema";
import { useModifierBiensMutation } from "@/features/biens/queries/biens-update.mutation";


type Props = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  bien: IBiens | null;
};

export function BiensUpdateModal({ isOpen, setIsOpen, bien }: Props) {
  const { mutateAsync: updateBien, isPending } = useModifierBiensMutation();

  const { setValue, handleSubmit, reset, watch, formState: { errors, isValid } } = useForm<BiensUpdateDTO>({
    resolver: zodResolver(BiensUpdateSchema),
    mode: "onChange",
  });

  // Fonction pour gérer les select
  const handleSelectChange = <T extends string>(field: keyof BiensUpdateDTO) =>
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setValue(field, e.target.value as T, { shouldValidate: true, shouldDirty: true });
    };

  const handleClose = useCallback(() => {
    if (!isPending) {
      setIsOpen(false);
      setTimeout(() => reset(), 200);
    }
  }, [isPending, setIsOpen, reset]);

  const onSubmit = useCallback(async (data: BiensUpdateDTO) => {
    if (!bien) return;
    await updateBien({ id: bien.id, data });
    handleClose();
  }, [updateBien, bien, handleClose]);

  // Remplir le formulaire quand le modal s'ouvre
  useEffect(() => {
    if (!isOpen || !bien) return;

  const mapListingType = (value: string) => {
  if (value === "SALE" || value === "RENT") return value;
  return "SALE"; // valeur par défaut
};

const mapStatus = (value: string): BiensStatus => {
  if (["DRAFT", "PUBLISHED", "ARCHIVED", "IN_PROGRESS"].includes(value)) {
    return value as BiensStatus;
  }
  return "DRAFT";
};

reset({
  title: bien.title,
  description: bien.description,
  listingType: mapListingType(bien.listingType),
  currency: bien.currency,
  price: bien.price,
  status: mapStatus(bien.status),
});

  }, [isOpen, bien, reset]);

  return (
    <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>
            <h1 className="text-lg font-medium text-primary">Modifier le bien: {bien?.title}</h1>
            <p className="text-sm text-gray-500">Formulaire pour mettre à jour un bien.</p>
          </ModalHeader>

          <ModalBody className="flex flex-col gap-4">
            {/* Titre */}
            <input
              type="text"
              placeholder="Titre"
              value={watch("title") || ""}
              onChange={(e) => setValue("title", e.target.value)}
              className="input input-bordered w-full"
            />
            {errors.title && <span className="text-danger">{errors.title.message}</span>}

            {/* Description */}
            <textarea
              placeholder="Description"
              value={watch("description") || ""}
              onChange={(e) => setValue("description", e.target.value)}
              className="textarea textarea-bordered w-full"
            />
            {errors.description && <span className="text-danger">{errors.description.message}</span>}

            {/* Listing Type */}
            <Select
              selectedKeys={[watch("listingType") || ""]}
              onChange={handleSelectChange<ListingType>("listingType")}
              disabled={isPending}
              variant="bordered"
            >
              {Object.values(ListingType).map((type) => (
                <SelectItem key={type}>{type}</SelectItem>
              ))}
            </Select>

            {/* Currency */}
            <Select
              selectedKeys={[watch("currency") || ""]}
              onChange={handleSelectChange<Currency>("currency")}
              disabled={isPending}
              variant="bordered"
            >
              {Object.values(Currency).map((cur) => (
                <SelectItem key={cur}>{cur}</SelectItem>
              ))}
            </Select>

            {/* Status */}
            <Select
              selectedKeys={[watch("status") || ""]}
              onChange={handleSelectChange<BiensStatus>("status")}
              disabled={isPending}
              variant="bordered"
            >
              {Object.values(BiensStatus).map((status) => (
                <SelectItem key={status}>{status}</SelectItem>
              ))}
            </Select>

            {/* Price */}
            <input
              type="text"
              placeholder="Prix"
              value={watch("price") || ""}
              onChange={(e) => setValue("price", e.target.value)}
              className="input input-bordered w-full"
            />
            {errors.price && <span className="text-danger">{errors.price.message}</span>}
          </ModalBody>

          <ModalFooter className="flex justify-end gap-2">
            <Button color="danger" variant="light" onPress={handleClose}>Annuler</Button>
            <Button type="submit" color="primary" isLoading={isPending} disabled={!isValid}>
              Modifier
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
