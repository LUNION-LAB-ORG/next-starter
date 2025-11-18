"use client";

import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Textarea,
} from "@heroui/react";
import { useEffect, useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import {
  BiensStatusEnum,
  BienUpdateDTO,
  BienUpdateSchema,
  CurrencyEnum,
  ListingTypeEnum,
  PricePeriodEnum,
} from "@/features/biens/schema/biens.schema";
import { useFileUpload } from "@/hooks/use-file-upload";

import { IBien } from "@/features/biens/types/biens.type";
import { useModifierBienMutation } from "@/features/biens/queries/biens-update.mutation";
import { useVillesListQuery } from "@/features/villes/queries/villes-list.query";
import { useCategoryListQuery } from "@/features/categorie/queries/category-list.query";
import type { IVille, IVillesParams } from "@/features/villes/types/villes.type";
import type { ICategory } from "@/features/categorie/types/categorie.type";
import type { PaginatedResponse } from "@/types/api.type";

// 🧩 Types externes : villes & catégories
type Ville = { id: string; name: string };
type Categorie = { id: string; label: string };

type Props = {
  isOpen: boolean;
  bien: IBien | null;
  onClose: () => void;
  villes?: Ville[];
  categories?: Categorie[];
  villesLoading?: boolean;
  categoriesLoading?: boolean;
  villesError?: boolean;
  categoriesError?: boolean;
};

export function BiensUpdateModal({
  isOpen,
  bien,
  onClose,
  villes = [],
  categories = [],
  villesLoading,
  categoriesLoading,
  villesError,
  categoriesError,
}: Props) {
  const { mutateAsync: updateBien, isPending } = useModifierBienMutation();

  // If parent did not provide villes/categories, fetch them here
  const [params] = useState<IVillesParams>({ page: 1, limit: 20 });
  const {
    data: villesData,
    isLoading: villesQueryLoading,
    isError: villesQueryError,
  } = useVillesListQuery(params);

  const {
    data: categoriesData,
    isLoading: categoriesQueryLoading,
    isError: categoriesQueryError,
  } = useCategoryListQuery(params);

  // typed guard for paginated responses
  function isPaginatedResponse<T>(obj: unknown): obj is PaginatedResponse<T> {
    return typeof obj === "object" && obj !== null && Array.isArray((obj as any).data);
  }

  const mergedVilles: IVille[] =
    villes && villes.length > 0
      ? (villes as IVille[])
      : isPaginatedResponse<IVille>(villesData)
      ? villesData.data
      : Array.isArray(villesData)
      ? (villesData as IVille[])
      : [];

  const mergedCategories: ICategory[] =
    categories && categories.length > 0
      ? (categories as ICategory[])
      : isPaginatedResponse<ICategory>(categoriesData)
      ? categoriesData.data
      : Array.isArray(categoriesData)
      ? (categoriesData as ICategory[])
      : [];

  const finalVillesLoading = villesLoading ?? villesQueryLoading;
  const finalCategoriesLoading = categoriesLoading ?? categoriesQueryLoading;
  const finalVillesError = villesError ?? villesQueryError;
  const finalCategoriesError = categoriesError ?? categoriesQueryError;

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    getValues,
    setError,
    formState: { errors, isValid },
  } = useForm<BienUpdateDTO>({
    resolver: zodResolver(BienUpdateSchema),
    mode: "onChange",
  });

  // file upload (images) - same behavior as add modal
  const [fileState, fileActions] = useFileUpload({
    multiple: true,
    accept: "image/*",
    maxFiles: 10,
    maxSize: 5 * 1024 * 1024,
    onFilesChange: (files) => {
      const onlyFiles = files
        .map((f) => f.file)
        .filter((f): f is File => f instanceof File);
      setValue("images" as any, onlyFiles, { shouldValidate: true });
    },
  });

  // 🔒 Fermeture sécurisée
  const handleClose = useCallback(() => {
    if (!isPending) {
      onClose();
      setTimeout(() => reset(), 200);
    }
  }, [isPending, onClose, reset]);

  // 🚀 Soumission du formulaire
  const onSubmit = useCallback(
    async (data: BienUpdateDTO) => {
      if (!bien) return;
      // Validate latitude / longitude client-side to match backend requirements
      const coordRegex = /^-?\d{1,3}(?:\.\d{1,6})?$/;
      let hasCoordError = false;

      const latVal = data.latitude;
      const lngVal = data.longitude;

      if (latVal !== undefined && latVal !== null && String(latVal) !== "") {
        if (!coordRegex.test(String(latVal).trim())) {
          try {
            setError("latitude" as any, {
              type: "validation",
              message:
                "La latitude doit être un nombre décimal avec jusqu'à 3 chiffres entiers et jusqu'à 6 décimales",
            });
          } catch (e) {}
          hasCoordError = true;
        } else {
          // normalize to max 6 decimals
          const parts = String(latVal).split(".");
          if (parts[1]) parts[1] = parts[1].slice(0, 6);
          data.latitude = parts.join(".");
        }
      }

      if (lngVal !== undefined && lngVal !== null && String(lngVal) !== "") {
        if (!coordRegex.test(String(lngVal).trim())) {
          try {
            setError("longitude" as any, {
              type: "validation",
              message:
                "La longitude doit être un nombre décimal avec jusqu'à 3 chiffres entiers et jusqu'à 6 décimales",
            });
          } catch (e) {}
          hasCoordError = true;
        } else {
          const parts = String(lngVal).split(".");
          if (parts[1]) parts[1] = parts[1].slice(0, 6);
          data.longitude = parts.join(".");
        }
      }

      if (hasCoordError) {
        toast.error("Veuillez corriger la latitude/longitude avant de soumettre.");
        return;
      }
      try {
        await updateBien({ id: bien.id, data });
        toast.success("Bien mis à jour avec succès !");
        handleClose();
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        // Try to extract backend-provided message after a colon (some actions prefix their errors)
        const backendMessage = message.includes(":")
          ? message.split(":").slice(1).join(":").trim()
          : message;

        // If the backend complains about images, attach the error to the `images` field so the form shows it inline
        if (backendMessage && /image/i.test(backendMessage)) {
          try {
            setError("images" as any, { type: "server", message: backendMessage });
          } catch (e) {
            // ignore setError failures
          }
        }

        toast.error(backendMessage || "Erreur lors de la mise à jour");
      }
    },
    [updateBien, bien, handleClose]
  );

  // 🪄 Préremplir le formulaire à l’ouverture
  useEffect(() => {
    if (!isOpen || !bien) return;

    reset({
      title: bien.title || "",
      description: bien.description || "",
      // Convert external ListingType (enum) to the form-expected union (zod ListingTypeEnum)
      listingType: (ListingTypeEnum.options as readonly string[]).includes(
        bien.listingType as unknown as string
      )
        ? (bien.listingType as unknown as z.infer<typeof ListingTypeEnum>)
        : ("SALE" as z.infer<typeof ListingTypeEnum>),
      // Ensure these fields are strings to match Zod schema
      price: bien.price !== undefined && bien.price !== null ? String(bien.price) : "",
      secondaryPrice:
        bien.secondaryPrice !== undefined && bien.secondaryPrice !== null
          ? String(bien.secondaryPrice)
          : "",
      currency: bien.currency,
      pricePeriod: bien.pricePeriod,
  area: bien.area !== undefined && bien.area !== null ? String(bien.area) : "",
  landArea: bien.landArea !== undefined && bien.landArea !== null ? String(bien.landArea) : "",
      rooms: bien.rooms,
      bedrooms: bien.bedrooms,
      bathrooms: bien.bathrooms,
      garages: bien.garages,
      garageCapacity: bien.garageCapacity,
      yearBuilt: bien.yearBuilt,
      cityId: bien.city,
      communeId: bien.communeId,
      areaId: bien.areaId,
      addressLine1: bien.addressLine1,
      addressLine2: bien.addressLine2,
      latitude: bien.latitude,
      longitude: bien.longitude,
      categoryId: bien.category,
      // Map status from backend enum to form zod enum; fallback to 'DRAFT' if not supported
      status: (BiensStatusEnum.options as readonly string[]).includes(
        bien.status as unknown as string
      )
        ? (bien.status as unknown as z.infer<typeof BiensStatusEnum>)
        : ("DRAFT" as z.infer<typeof BiensStatusEnum>),
    });
  }, [isOpen, bien, reset]);

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => !open && handleClose()}
      scrollBehavior="inside"
    >
      <ModalContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-8 space-y-6 bg-white dark:bg-gray-950 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 max-w-5xl mx-auto"
        >
          <ModalHeader>
            <div className="flex items-center justify-between w-full">
              <div>
                <h1 className="text-2xl font-extrabold text-primary">Modifier le bien</h1>
                <p className="text-sm text-muted-foreground mt-1">{bien?.title}</p>
              </div>
              <div className="text-right text-sm text-muted-foreground">
                <div>{bien?.city ?? "—"}</div>
              </div>
            </div>
          </ModalHeader>

          <ModalBody className="grid grid-cols-2 gap-6">
            {/* Images */}
            <div className="col-span-2 border-2 border-dashed p-4 rounded text-center cursor-pointer hover:bg-gray-50 transition-colors" onClick={fileActions.openFileDialog}>
              <input {...fileActions.getInputProps()} className="hidden" />
              <p className="text-sm text-gray-600">
                {fileState.files.length === 0
                  ? "Glissez des images ici ou cliquez pour sélectionner"
                  : `${fileState.files.length} image(s) sélectionnée(s)`}
              </p>
              {errors.images && (
                <p className="text-sm text-red-500 mt-1">{errors.images.message}</p>
              )}
            </div>

            {/* Titre */}
            <Input
              {...register("title")}
              label="Titre"
              isInvalid={!!errors.title}
              errorMessage={errors.title?.message}
            />

            {/* Type d’annonce */}
            <Select
              label="Type d’annonce"
              selectedKeys={[watch("listingType") || ""]}
              onChange={(e) =>
                setValue("listingType", e.target.value as z.infer<typeof ListingTypeEnum>)
              }
            >
              {ListingTypeEnum.options.map((t) => (
                <SelectItem key={t}>{t}</SelectItem>
              ))}
            </Select>

            {/* Description */}
            <Textarea
              {...register("description")}
              label="Description"
              className="col-span-2"
              placeholder="Décrivez le bien..."
            />

            {/* Prix */}
            <Input {...register("price")} label="Prix principal" type="text" />
            <Input {...register("secondaryPrice")} label="Prix secondaire" type="text" />

            {/* Devise */}
            <Select
              label="Devise"
              selectedKeys={[watch("currency") || ""]}
              onChange={(e) =>
                setValue("currency", e.target.value as z.infer<typeof CurrencyEnum>)
              }
            >
              {CurrencyEnum.options.map((cur) => (
                <SelectItem key={cur}>{cur}</SelectItem>
              ))}
            </Select>

            {/* Période */}
            <Select
              label="Période"
              selectedKeys={[watch("pricePeriod") || ""]}
              onChange={(e) =>
                setValue("pricePeriod", e.target.value as z.infer<typeof PricePeriodEnum>)
              }
            >
              {PricePeriodEnum.options.map((per) => (
                <SelectItem key={per}>{per}</SelectItem>
              ))}
            </Select>

            {/* Détails physiques */}
            <Input {...register("area")} label="Surface habitable (m²)" type="text" />
            <Input {...register("landArea")} label="Surface du terrain (m²)" type="text" />
            <Input {...register("rooms")} label="Pièces" type="number" />
            <Input {...register("bedrooms")} label="Chambres" type="number" />
            <Input {...register("bathrooms")} label="Salles de bain" type="number" />
            <Input {...register("garages")} label="Garages" type="number" />
            <Input {...register("garageCapacity")} label="Capacité garage" type="number" />
            <Input {...register("yearBuilt")} label="Année de construction" type="number" />

            {/* Ville */}
            <Select
              label="Ville"
              placeholder={
                villesLoading
                  ? "Chargement..."
                  : villesError
                  ? "Erreur de chargement"
                  : "Sélectionnez une ville"
              }
              selectedKeys={[getValues("cityId") || ""]}
              onChange={(e) => setValue("cityId", e.target.value)}
              isDisabled={villesLoading || villesError}
            >
              {mergedVilles.map((v) => (
                  <SelectItem key={v.id} data-value={v.id}>{v.name}</SelectItem>
                ))}
            </Select>

            {/* Catégorie */}
            <Select
              label="Catégorie"
              placeholder={
                categoriesLoading
                  ? "Chargement..."
                  : categoriesError
                  ? "Erreur de chargement"
                  : "Sélectionnez une catégorie"
              }
              selectedKeys={[getValues("categoryId") || ""]}
              onChange={(e) => setValue("categoryId", e.target.value)}
              isDisabled={categoriesLoading || categoriesError}
            >
              {mergedCategories.map((c) => (
                <SelectItem key={c.id} dat-value={c.id}>{c.label}</SelectItem>
              ))}
            </Select>

            {/* --- Upload images (mise à jour) --- */}
            <div
              className="col-span-2 border-2 border-dashed p-4 rounded text-center cursor-pointer"
              onClick={fileActions.openFileDialog}
            >
              <input {...fileActions.getInputProps()} className="hidden" />
              {fileState.files.length === 0
                ? (bien?.images && bien.images.length > 0
                    ? `${bien.images.length} image(s) existante(s) — ajoutez-en pour les remplacer` 
                    : "Glissez vos images ici ou cliquez")
                : `${fileState.files.length} image(s) sélectionnée(s)`}
            </div>

            {/* Adresse */}
            <Input {...register("addressLine1")} label="Adresse principale" />
            <Input {...register("addressLine2")} label="Complément d’adresse" />
            <Input {...register("latitude")} label="Latitude" />
            <Input {...register("longitude")} label="Longitude" />

            {/* Statut */}
            <Select
              label="Statut du bien"
              selectedKeys={[watch("status") || ""]}
              onChange={(e) =>
                setValue("status", e.target.value as z.infer<typeof BiensStatusEnum>)
              }
            >
              {BiensStatusEnum.options.map((s) => (
                <SelectItem key={s}>{s}</SelectItem>
              ))}
            </Select>
          </ModalBody>

          <ModalFooter className="flex items-center justify-end gap-3">
            <Button variant="ghost" onPress={handleClose} className="px-4 py-2">
              Annuler
            </Button>
            <Button
              type="submit"
              color="primary"
              disabled={!isValid}
              isLoading={isPending}
              className="px-6 py-2 rounded-md text-sm font-semibold"
            >
              Enregistrer
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
