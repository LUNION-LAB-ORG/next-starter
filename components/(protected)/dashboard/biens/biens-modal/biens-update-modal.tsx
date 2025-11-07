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
  BiensUpdateDTO,
  BiensUpdateSchema,
  CurrencyEnum,
  ListingTypeEnum,
  PricePeriodEnum,
} from "@/features/biens/schema/biens.schema";

import { IBiens } from "@/features/biens/types/biens.type";
import { useModifierBiensMutation } from "@/features/biens/queries/biens-update.mutation";
import { useVillesListQuery } from "@/features/villes/queries/villes-list.query";
import { useCategoryListQuery } from "@/features/categorie/queries/category-list.query";
import type { IVilles, IVillesParams } from "@/features/villes/types/villes.type";
import type { ICategory } from "@/features/categorie/types/categorie.type";
import type { PaginatedResponse } from "@/types/api.type";

// 🧩 Types externes : villes & catégories
type Ville = { id: string; name: string };
type Categorie = { id: string; label: string };

type Props = {
  isOpen: boolean;
  bien: IBiens | null;
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
  const { mutateAsync: updateBien, isPending } = useModifierBiensMutation();

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

  const mergedVilles: IVilles[] =
    villes && villes.length > 0
      ? (villes as IVilles[])
      : isPaginatedResponse<IVilles>(villesData)
      ? villesData.data
      : Array.isArray(villesData)
      ? (villesData as IVilles[])
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
  } = useForm<BiensUpdateDTO>({
    resolver: zodResolver(BiensUpdateSchema),
    mode: "onChange",
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
    async (data: BiensUpdateDTO) => {
      if (!bien) return;
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
      cityId: bien.cityId,
      communeId: bien.communeId,
      areaId: bien.areaId,
      addressLine1: bien.addressLine1,
      addressLine2: bien.addressLine2,
      latitude: bien.latitude,
      longitude: bien.longitude,
      categoryId: bien.categoryId,
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
                <div>{bien?.cityId ?? "—"}</div>
              </div>
            </div>
          </ModalHeader>

          <ModalBody className="grid grid-cols-2 gap-6">
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
