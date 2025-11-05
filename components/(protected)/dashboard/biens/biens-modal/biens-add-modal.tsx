"use client";

import {
  Button,
  Input,
  Select,
  SelectItem,
  Textarea,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalContent,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CheckCircle2, X } from "lucide-react";
import { toast } from "sonner";

import { useAjouterBiensMutation } from "@/features/biens/queries/biens-add.mutation";
import {
  BiensAddDTO,
  BiensAddSchema,
  BiensStatusEnum,
  CurrencyEnum,
  ListingTypeEnum,
  PricePeriodEnum,
} from "@/features/biens/schema/biens.schema";
import { useFileUpload } from "@/hooks/use-file-upload";

export function BiensAddModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVilleModalOpen, setIsVilleModalOpen] = useState(false);
  const [isCategorieModalOpen, setIsCategorieModalOpen] = useState(false);

  const { mutateAsync: biensCreateMutation, isPending: biensCreatePending } =
    useAjouterBiensMutation();

  const [fileState, fileActions] = useFileUpload({
    multiple: true,
    accept: "image/*",
    maxFiles: 10,
    maxSize: 5 * 1024 * 1024,
    onFilesChange: (files) => {
      const onlyFiles = files
        .map((f) => f.file)
        .filter((f): f is File => f instanceof File);
      setValue("images", onlyFiles, { shouldValidate: true });
    },
  });

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
  } = useForm<BiensAddDTO>({
    resolver: zodResolver(BiensAddSchema),
    mode: "onChange",
    defaultValues: {
      title: "moana",
      description: "description du bien",
      listingType: "RENT",
      price: "2000",
      secondaryPrice: "500",
      currency: "XOF",
      pricePeriod: "MONTH",
      area: "250",
      landArea: "500",
      rooms: 5,
      bedrooms: 2,
      bathrooms: 2,
      garages: 1,
      garageCapacity: 20,
      yearBuilt: 2020,
      cityId: "cmhk83omy0000942gni9459ta",
      communeId: undefined,
      areaId: undefined,
      addressLine1: "Adresse principale exemple",
      addressLine2: "Complément d’adresse exemple",
      latitude: "5.34532",
      longitude: "4.008256",
      categoryId: "cmhhll3kn000594s4tw1qodw2",
      status: "DRAFT",
      images: [],
    },
  });

  const handleClose = useCallback(() => {
    if (!biensCreatePending) {
      setIsOpen(false);
      setTimeout(() => reset(), 200);
    }
  }, [biensCreatePending, reset]);

  const onSubmit = useCallback(
    async (data: BiensAddDTO) => {
      const payload = { ...data };
      if (!payload.communeId) delete payload.communeId;
      if (!payload.areaId) delete payload.areaId;
      if (!payload.addressLine2) delete payload.addressLine2;
      if (!payload.video) delete payload.video;

      try {
        await biensCreateMutation(payload);
        toast.success("Bien ajouté avec succès !", {
          icon: <CheckCircle2 className="text-green-500" />,
        });
        handleClose();
      } catch (error: any) {
        toast.error(error?.message || "Impossible d’ajouter le bien.", {
          icon: <X className="text-red-500" />,
        });
      }
    },
    [biensCreateMutation, handleClose]
  );

  // --- Sous-formulaire : Créer une ville ---
  const VilleModal = () => (
    <Modal isOpen={isVilleModalOpen} onOpenChange={setIsVilleModalOpen}>
      <ModalContent>
        <ModalHeader>Ajouter une Ville</ModalHeader>
        <ModalBody className="space-y-3">
          <Input label="Nom de la ville" placeholder="Ex: Abidjan" />
          <Input label="Code du pays" placeholder="Ex: CI" />
          <Textarea
            label="Communes (séparées par des virgules)"
            placeholder="Cocody, Yopougon, Treichville..."
          />
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={() => setIsVilleModalOpen(false)}>
            Annuler
          </Button>
          <Button color="primary">Enregistrer</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );

  // --- Sous-formulaire : Créer une catégorie ---
  const CategorieModal = () => (
    <Modal isOpen={isCategorieModalOpen} onOpenChange={setIsCategorieModalOpen}>
      <ModalContent>
        <ModalHeader>Ajouter une Catégorie</ModalHeader>
        <ModalBody className="space-y-3">
          <Input label="Label" placeholder="Ex: Villa" />
          <Input label="Parent ID (optionnel)" placeholder="Ex: cmhhll3kn00..." />
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={() => setIsCategorieModalOpen(false)}>
            Annuler
          </Button>
          <Button color="primary">Enregistrer</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );

  return (
    <div className="space-y-6">
      {/* Boutons principaux */}
      <div className="flex gap-3">
        <Button color="primary" onPress={() => setIsOpen((p) => !p)}>
          {isOpen ? "Fermer le formulaire" : "Ajouter un bien"}
        </Button>

        <Button color="secondary" onPress={() => setIsVilleModalOpen(true)}>
          Ajouter une ville
        </Button>

        <Button color="warning" onPress={() => setIsCategorieModalOpen(true)}>
          Ajouter une catégorie
        </Button>
      </div>

      {isOpen && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="border rounded-xl p-8 shadow-md bg-white w-full h-[90vh] overflow-y-scroll"
        >
          <h1 className="text-xl font-semibold text-primary mb-6">
            Ajouter un bien immobilier
          </h1>

          {/* ✅ disposition en 2 colonnes */}
          <div className="grid grid-cols-2 gap-4">
            <Input {...register("title")} label="Titre" />
            <Select
              label="Type d’annonce"
              onChange={(e) =>
                setValue("listingType", e.target.value as z.infer<typeof ListingTypeEnum>)
              }
            >
              {ListingTypeEnum.options.map((t) => (
                <SelectItem key={t}>{t}</SelectItem>
              ))}
            </Select>

            <Textarea
              {...register("description")}
              label="Description"
              className="col-span-2"
              placeholder="Décrivez le bien..."
            />

            <Input {...register("price")} label="Prix principal" />
            <Input {...register("secondaryPrice")} label="Prix secondaire" />
            <Select
              label="Devise"
              onChange={(e) =>
                setValue("currency", e.target.value as z.infer<typeof CurrencyEnum>)
              }
            >
              {CurrencyEnum.options.map((cur) => (
                <SelectItem key={cur}>{cur}</SelectItem>
              ))}
            </Select>
            <Select
              label="Période"
              onChange={(e) =>
                setValue("pricePeriod", e.target.value as z.infer<typeof PricePeriodEnum>)
              }
            >
              {PricePeriodEnum.options.map((per) => (
                <SelectItem key={per}>{per}</SelectItem>
              ))}
            </Select>

            <Input {...register("area")} label="Surface habitable (m²)" />
            <Input {...register("landArea")} label="Surface du terrain (m²)" />
            <Input {...register("rooms")} label="Pièces" type="number" />
            <Input {...register("bedrooms")} label="Chambres" type="number" />
            <Input {...register("bathrooms")} label="Salles de bain" type="number" />
            <Input {...register("garages")} label="Garages" type="number" />
            <Input {...register("garageCapacity")} label="Capacité garage" type="number" />
            <Input {...register("yearBuilt")} label="Année de construction" type="number" />

            <Input {...register("cityId")} label="Ville ID" />
            <Input {...register("communeId")} label="Commune ID" />
            <Input {...register("areaId")} label="Quartier" />
            <Input {...register("addressLine1")} label="Adresse principale" />
            <Input {...register("addressLine2")} label="Complément d’adresse" />
            <Input {...register("latitude")} label="Latitude" />
            <Input {...register("longitude")} label="Longitude" />
            <Input {...register("categoryId")} label="Catégorie ID" />

            {/* Upload simple */}
            <div className="col-span-2 border-2 border-dashed p-4 rounded text-center cursor-pointer"
              onClick={fileActions.openFileDialog}
            >
              <input {...fileActions.getInputProps()} className="hidden" />
              {fileState.files.length === 0
                ? "Glissez vos images ici ou cliquez"
                : `${fileState.files.length} image(s) sélectionnée(s)`}
            </div>

            <Select
              label="Statut du bien"
              onChange={(e) =>
                setValue("status", e.target.value as z.infer<typeof BiensStatusEnum>)
              }
            >
              {BiensStatusEnum.options.map((status) => (
                <SelectItem key={status}>{status}</SelectItem>
              ))}
            </Select>
          </div>

          {/* Footer */}
          <div className="flex justify-end mt-6 gap-3">
            <Button variant="light" onPress={handleClose}>
              Annuler
            </Button>
            <Button color="primary" type="submit" disabled={!isValid} isLoading={biensCreatePending}>
              Ajouter
            </Button>
          </div>
        </form>
      )}

      {/* Modales annexes */}
      <VilleModal />
      <CategorieModal />
    </div>
  );
}
