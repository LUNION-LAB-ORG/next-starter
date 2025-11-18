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
import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CheckCircle2, X } from "lucide-react";
import { toast } from "sonner";

import { useAjouterBiensMutation } from "@/features/biens/queries/biens-add.mutation";
import {
  BienAddDTO,
  BiensAddSchema,
  BiensStatusEnum,
  CurrencyEnum,
  ListingTypeEnum,
  PricePeriodEnum,
} from "@/features/biens/schema/biens.schema";
import { useFileUpload } from "@/hooks/use-file-upload";
import {
  CreateVillesDTO,
  CreateVillesSchema,
} from "@/features/villes/schema/villes.schema";
import { useAjouterVillesMutation } from "@/features/villes/queries/villes-add.mutation";
import { useVillesListQuery } from "@/features/villes/queries/villes-list.query";
import { useCategoryListQuery } from "@/features/categorie/queries/category-list.query";
import {
  CreateCategoryDTO,
  CreateCategorySchema,
} from "@/features/categorie/schema/categorie.schema";
import { useAjouterCategoryMutation } from "@/features/categorie/queries/category-add.mutation";

import type { PaginatedResponse } from "@/types/api.type";
import type {
  IVille,
  IVillesParams,
} from "@/features/villes/types/villes.type";
import type { ICategory } from "@/features/categorie/types/categorie.type";

/* --- 📘 Réutilisation des types partagés --- */

/* --- 🏠 Composant principal --- */

export function BiensAddModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [params] = React.useState<IVillesParams>({ page: 1, limit: 20 });
  const [isVilleModalOpen, setIsVilleModalOpen] = useState(false);
  const [isCategorieModalOpen, setIsCategorieModalOpen] = useState(false);

  const { data, isLoading, isError, refetch } = useVillesListQuery(params);
  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    isError: categoriesError,
    refetch: refetchCategories,
  } = useCategoryListQuery(params);

  React.useEffect(() => {
    if (data) console.log("Liste des villes dans la modale est :", data);
  }, [data]);

  React.useEffect(() => {
    if (categoriesData)
      console.log("Liste des categories dans la modale est :", categoriesData);
  }, [categoriesData]);

  // ✅ Correction du typage des listes
  // Helper type guard to detect paginated responses without using `any`
  function isPaginatedResponse<T>(obj: unknown): obj is PaginatedResponse<T> {
    if (typeof obj !== "object" || obj === null) return false;
    const record = obj as Record<string, unknown>;
    return Array.isArray(record.data);
  }

  // Villes : gérer tableau ou paginé
  const villesList: IVille[] = Array.isArray(data)
    ? data
    : isPaginatedResponse<IVille>(data)
      ? data.data
      : [];

  // Catégories : gérer tableau ou paginé
  const categoriesList: ICategory[] = Array.isArray(categoriesData)
    ? categoriesData
    : isPaginatedResponse<ICategory>(categoriesData)
      ? categoriesData.data
      : [];

  const { mutateAsync: biensCreateMutation, isPending: biensCreatePending } =
    useAjouterBiensMutation();
  const { mutateAsync: villesCreateMutation, isPending: villesCreatePending } =
    useAjouterVillesMutation();

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
    getValues,
  } = useForm<BienAddDTO>({
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
      cityId: undefined,
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
    async (data: BienAddDTO) => {
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
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        toast.error(message || "Impossible d’ajouter le bien.", {
          icon: <X className="text-red-500" />,
        });
      }
    },
    [biensCreateMutation, handleClose],
  );

  /* --- 🏙️ Sous-formulaire : Ajouter une Ville --- */
  const VilleModal = () => {
    const {
      register,
      handleSubmit,
      formState: { errors, isValid },
      reset,
    } = useForm<CreateVillesDTO>({
      resolver: zodResolver(CreateVillesSchema),
      mode: "onChange",
      defaultValues: {
        name: "Abidjan",
        countryCode: "CI",
        communes: [],
      },
    });

    const onSubmitVille = useCallback(
      async (data: CreateVillesDTO) => {
        // `CreateVillesDTO` schema already normalizes `communes` to string[] via Zod transform,
        // so we can rely on its type here.
        const payload: CreateVillesDTO = data;

        // If communes is an empty array we still send it (schema accepts it). If you'd rather
        // omit it when empty, construct a partial payload - but mutation expects CreateVillesDTO.

        try {
          await villesCreateMutation(payload);
          toast.success(`Ville "${payload.name}" ajoutée avec succès !`, {
            icon: <CheckCircle2 className="text-green-500" />,
          });
          setIsVilleModalOpen(false);
          reset();
          refetch();
        } catch (error) {
          const message =
            error instanceof Error ? error.message : String(error);
          toast.error(message || "Impossible d’ajouter la ville.", {
            icon: <X className="text-red-500" />,
          });
        }
      },
      [villesCreateMutation, reset, refetch],
    );

    return (
      <Modal isOpen={isVilleModalOpen} onOpenChange={setIsVilleModalOpen}>
        <ModalContent>
          <form onSubmit={handleSubmit(onSubmitVille)}>
            <ModalHeader>Ajouter une Ville</ModalHeader>
            <ModalBody className="space-y-3">
              <Input
                label="Nom de la ville"
                placeholder="Ex: Abidjan"
                {...register("name")}
                isInvalid={!!errors.name}
                errorMessage={errors.name?.message}
              />

              <Input
                label="Code du pays"
                placeholder="Ex: CI"
                {...register("countryCode")}
                isInvalid={!!errors.countryCode}
                errorMessage={errors.countryCode?.message}
              />

              <Textarea
                label="Communes (séparées par des virgules)"
                placeholder="Cocody, Yopougon, Treichville..."
                {...register("communes")}
                errorMessage={errors.communes?.message as string}
              />
            </ModalBody>

            <ModalFooter>
              <Button
                variant="light"
                onPress={() => setIsVilleModalOpen(false)}
              >
                Annuler
              </Button>
              <Button
                color="primary"
                type="submit"
                disabled={!isValid}
                isLoading={villesCreatePending}
              >
                Enregistrer
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    );
  };

  /* --- 🗂️ Sous-formulaire : Ajouter une Catégorie --- */
  const CategorieModal = () => {
    const {
      register,
      handleSubmit,
      formState: { errors, isValid },
      reset,
    } = useForm<CreateCategoryDTO>({
      resolver: zodResolver(CreateCategorySchema),
      mode: "onChange",
      defaultValues: { label: "Villa", parentId: "" },
    });

    const {
      mutateAsync: categorieCreateMutation,
      isPending: categorieCreatePending,
    } = useAjouterCategoryMutation();

    const onSubmitCategorie = useCallback(
      async (data: CreateCategoryDTO) => {
        const payload = { ...data };
        if (!payload.parentId) delete payload.parentId;

        try {
          await categorieCreateMutation(payload);
          toast.success(`Catégorie "${payload.label}" ajoutée avec succès !`, {
            icon: <CheckCircle2 className="text-green-500" />,
          });
          setIsCategorieModalOpen(false);
          reset();
          refetchCategories();
        } catch (error) {
          const message =
            error instanceof Error ? error.message : String(error);
          toast.error(message || "Impossible d’ajouter la catégorie.", {
            icon: <X className="text-red-500" />,
          });
        }
      },
      [categorieCreateMutation, reset, refetchCategories],
    );

    return (
      <Modal
        isOpen={isCategorieModalOpen}
        onOpenChange={setIsCategorieModalOpen}
      >
        <ModalContent>
          <form onSubmit={handleSubmit(onSubmitCategorie)}>
            <ModalHeader>Ajouter une Catégorie</ModalHeader>
            <ModalBody className="space-y-3">
              <Input
                label="Nom de la catégorie"
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
              <Button
                variant="light"
                onPress={() => setIsCategorieModalOpen(false)}
              >
                Annuler
              </Button>
              <Button
                color="primary"
                type="submit"
                disabled={!isValid}
                isLoading={categorieCreatePending}
              >
                Enregistrer
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    );
  };

  /* --- Rendu principal --- */
  return (
    <div className="space-y-6">
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

          <div className="grid grid-cols-2 gap-4">
            <Input
              {...register("title")}
              label="Titre"
              isInvalid={!!errors.title}
            />

            <Select
              label="Type d’annonce"
              onChange={(e) =>
                setValue(
                  "listingType",
                  e.target.value as z.infer<typeof ListingTypeEnum>,
                )
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
                setValue(
                  "currency",
                  e.target.value as z.infer<typeof CurrencyEnum>,
                )
              }
            >
              {CurrencyEnum.options.map((cur) => (
                <SelectItem key={cur}>{cur}</SelectItem>
              ))}
            </Select>

            <Select
              label="Période"
              onChange={(e) =>
                setValue(
                  "pricePeriod",
                  e.target.value as z.infer<typeof PricePeriodEnum>,
                )
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
            <Input
              {...register("bathrooms")}
              label="Salles de bain"
              type="number"
            />
            <Input {...register("garages")} label="Garages" type="number" />
            <Input
              {...register("garageCapacity")}
              label="Capacité garage"
              type="number"
            />
            <Input
              {...register("yearBuilt")}
              label="Année de construction"
              type="number"
            />

            {/* --- Sélecteur de ville --- */}
            <Select
              label="Ville"
              placeholder={
                isLoading ? "Chargement..." : "Sélectionnez une ville"
              }
              isDisabled={isLoading || isError}
              isInvalid={!!errors.cityId}
              errorMessage={errors.cityId?.message}
              {...register("cityId", { required: "La ville est requise" })}
            >
              {villesList.map((ville) => (
                <SelectItem key={ville.id} dat-value={ville.id}>
                  {ville.name}
                </SelectItem>
              ))}
            </Select>

            <Input {...register("communeId")} label="Commune ID" />
            <Input {...register("areaId")} label="Quartier" />
            <Input {...register("addressLine1")} label="Adresse principale" />
            <Input {...register("addressLine2")} label="Complément d’adresse" />
            <Input {...register("latitude")} label="Latitude" />
            <Input {...register("longitude")} label="Longitude" />

            {/* --- Sélecteur de catégorie --- */}
            <Select
              label="Catégorie"
              placeholder={
                categoriesLoading
                  ? "Chargement..."
                  : "Sélectionnez une catégorie"
              }
              isDisabled={categoriesLoading || categoriesError}
              value={getValues("categoryId") || ""}
              onChange={(e) => setValue("categoryId", e.target.value)}
            >
              {categoriesList.map((category) => (
                <SelectItem key={category.id} data-value={category.id}>
                  {category.label}
                </SelectItem>
              ))}
            </Select>

            {/* --- Upload images --- */}
            <div
              className="col-span-2 border-2 border-dashed p-4 rounded text-center cursor-pointer"
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
                setValue(
                  "status",
                  e.target.value as z.infer<typeof BiensStatusEnum>,
                )
              }
            >
              {BiensStatusEnum.options.map((status) => (
                <SelectItem key={status}>{status}</SelectItem>
              ))}
            </Select>
          </div>

          <div className="flex justify-end mt-6 gap-3">
            <Button variant="light" onPress={handleClose}>
              Annuler
            </Button>
            <Button
              color="primary"
              type="submit"
              disabled={!isValid}
              isLoading={biensCreatePending}
            >
              Ajouter
            </Button>
          </div>
        </form>
      )}

      <VilleModal />
      <CategorieModal />
    </div>
  );
}
