"use client";

import { Button, Input, Select, SelectItem, Textarea } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  BiensAddDTO,
  BiensAddSchema,
  BiensStatusEnum,
  CurrencyEnum,
  ListingTypeEnum,
  PricePeriodEnum,
} from "@/features/biens/schema/biens.schema";
import { useFileUpload } from "@/hooks/use-file-upload";
import { toast } from "sonner";
import { CheckCircle2, Target, X } from "lucide-react";
import { ajouterBiensAction } from "@/features/biens/actions/biens.action";
import { useAjouterBiensMutation } from "@/features/biens/queries/biens-add.mutation";

export function BiensAddModal() {
  const [isOpen, setIsOpen] = useState(false);

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
    defaultValues:
    {
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
  images: [], // ← obligatoire même si vide
 
 
}
,
  });

  const handleClose = useCallback(() => {
    if (!biensCreatePending) {
      setIsOpen(false);
      setTimeout(() => reset(), 200);
    }
  }, [biensCreatePending, reset]);

 const onSubmit = useCallback(
  async (data: BiensAddDTO) => {
    // Nettoyage du payload : on retire les champs optionnels vides
    const payload = { ...data };
    if (!payload.communeId) delete payload.communeId;
    if (!payload.areaId) delete payload.areaId;
    if (!payload.addressLine2) delete payload.addressLine2;
    if (!payload.video) delete payload.video;
    // Ajoute ici d'autres champs optionnels si besoin

    console.log("Submitting cleaned data:", payload);

    try {
      // Appel à la mutation avec le payload nettoyé
      const bien = await biensCreateMutation(payload);

      // Si on arrive ici, c'est que tout a réussi
      toast.success("Bien ajouté avec succès !", {
        icon: <CheckCircle2 className="text-green-500" />,
      });

      handleClose();
    } catch (error: any) {
      console.error("Erreur onSubmit:", error);
      toast.error(error?.message || "Impossible d’ajouter le bien.", {
        icon: <X className="text-red-500" />,
      });
    }
  },
  [biensCreateMutation, handleClose]
);
  console.log("watch images", watch());

  return (
    <div className="space-y-6">
      <Button color="primary" onPress={() => setIsOpen((prev) => !prev)}>
        {isOpen ? "Fermer le formulaire" : "Ajouter un bien"}
      </Button>

      {isOpen && (
        <form
  onSubmit={handleSubmit(onSubmit)}
  className="border rounded-xl p-6 shadow-md bg-white h-[90vh] w-full overflow-y-scroll"
>
  {/* En-tête */}
  <div className="flex flex-col gap-1 mb-4">
    <h1 className="text-lg font-medium text-primary">Ajouter un bien</h1>
    <p className="text-sm text-gray-500">
      Remplissez le formulaire pour enregistrer un bien immobilier.
    </p>
  </div>

  {/* Contenu du formulaire */}
  <div className="space-y-3">
    <Input
      {...register("title")}
      label="Titre"
      placeholder="Ex: Villa moderne à Cocody"
      errorMessage={errors.title?.message}
      isInvalid={!!errors.title}
      disabled={biensCreatePending}
      variant="bordered"
    />

    <Textarea
      {...register("description")}
      label="Description"
      placeholder="Décrivez le bien..."
      errorMessage={errors.description?.message}
      isInvalid={!!errors.description}
      disabled={biensCreatePending}
      variant="bordered"
    />

    <Select
      label="Type d’annonce"
      placeholder="Choisir le type"
      onChange={(e) =>
        setValue(
          "listingType",
          e.target.value as z.infer<typeof ListingTypeEnum>,
          { shouldValidate: true }
        )
      }
      isInvalid={!!errors.listingType}
      errorMessage={errors.listingType?.message}
      disabled={biensCreatePending}
    >
      {ListingTypeEnum.options.map((type) => (
        <SelectItem key={type} textValue={type}>
          {type}
        </SelectItem>
      ))}
    </Select>

    <Input
      {...register("price")}
      label="Prix principal"
      placeholder="Ex: 15000000"
      errorMessage={errors.price?.message}
      isInvalid={!!errors.price}
      disabled={biensCreatePending}
      type="string"
      variant="bordered"
    />
    <Input
      {...register("secondaryPrice")}
      label="Prix secondaire (optionnel)"
      errorMessage={errors.secondaryPrice?.message}
      isInvalid={!!errors.secondaryPrice}
      disabled={biensCreatePending}
      type="string"
      variant="bordered"
    />

    <Select
      label="Devise"
      placeholder="Choisir une devise"
      onChange={(e) =>
        setValue("currency", e.target.value as z.infer<typeof CurrencyEnum>, {
          shouldValidate: true,
        })
      }
      isInvalid={!!errors.currency}
      errorMessage={errors.currency?.message}
      disabled={biensCreatePending}
    >
      {CurrencyEnum.options.map((cur) => (
        <SelectItem key={cur} textValue={cur}>
          {cur}
        </SelectItem>
      ))}
    </Select>

    <Select
      label="Période de prix"
      placeholder="Choisir une période"
      onChange={(e) =>
        setValue(
          "pricePeriod",
          e.target.value as z.infer<typeof PricePeriodEnum>,
          { shouldValidate: true }
        )
      }
      isInvalid={!!errors.pricePeriod}
      errorMessage={errors.pricePeriod?.message}
      disabled={biensCreatePending}
    >
      {PricePeriodEnum.options.map((period) => (
        <SelectItem key={period} textValue={period}>
          {period}
        </SelectItem>
      ))}
    </Select>

    {/* Caractéristiques */}
    <Input {...register("area")} label="Surface habitable (m²)" type="string" />
    <Input {...register("landArea")} label="Surface du terrain (m²)" type="string" />
    <Input {...register("rooms")} label="Nombre total de pièces" type="number" />
    <Input {...register("bedrooms")} label="Chambres" type="number" />
    <Input {...register("bathrooms")} label="Salles de bain" type="number" />
    <Input {...register("garages")} label="Garages" type="number" />
    <Input {...register("garageCapacity")} label="Capacité du garage" type="number" />
    <Input {...register("yearBuilt")} label="Année de construction" type="number" />

    {/* Localisation */}
    <Input {...register("cityId")} label="Ville" placeholder="Ex: Abidjan" />
    <Input {...register("communeId")} label="Commune" placeholder="Ex: Cocody" />
    <Input {...register("areaId")} label="Quartier / Zone" placeholder="Ex: Riviera" />
    <Input {...register("addressLine1")} label="Adresse principale" />
    <Input {...register("addressLine2")} label="Complément d’adresse" />

    {/* Coordonnées GPS */}
    <Input {...register("latitude")} label="Latitude" type="string" />
    <Input {...register("longitude")} label="Longitude" type="string" />

    {/* Catégorie et équipements */}
    <Input
      {...register("categoryId")}
      label="Catégorie ID"
      placeholder="Ex: villa, appartement..."
    />

    {/* Médias */}
    <div>
      <div>Images du bien</div>
      <div
        className={`border-2 border-dashed p-4 rounded cursor-pointer ${
          fileState.isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
        }`}
        onDragEnter={fileActions.handleDragEnter}
        onDragLeave={fileActions.handleDragLeave}
        onDragOver={fileActions.handleDragOver}
        onDrop={fileActions.handleDrop}
        onClick={fileActions.openFileDialog}
      >
        <input
          {...fileActions.getInputProps()}
          className="hidden"
          name="images"
        />
        {fileState.files.length === 0 ? (
          <p>Glissez vos images ici ou cliquez pour sélectionner</p>
        ) : (
          <p>{fileState.files.length} image(s) sélectionnée(s)</p>
        )}
      </div>
      {fileState.errors.length > 0 && (
        <div className="text-red-500 mt-2">
          {fileState.errors.map((err, i) => (
            <p key={i}>{err}</p>
          ))}
        </div>
      )}
      <div className="grid grid-cols-3 gap-4 mt-4">
        {fileState.files.map((file) => (
          <div key={file.id} className="relative">
            {file.preview && (
              <img
                src={file.preview}
                alt={file.file.name}
                className="w-full h-32 object-cover rounded"
              />
            )}
            <button
              type="button"
              onClick={() => fileActions.removeFile(file.id)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>

    <Input
      name="video"
      label="Vidéo"
      type="file"
      onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) setValue("video", file, { shouldValidate: true });
      }}
    />

    {/* Statut du bien */}
    <Select
      name="status"
      label="Statut du bien"
      placeholder="Choisir le statut"
      onChange={(e) =>
        setValue(
          "status",
          e.target.value as z.infer<typeof BiensStatusEnum>,
          { shouldValidate: true }
        )
      }
      isInvalid={!!errors.status}
      errorMessage={errors.status?.message}
      disabled={biensCreatePending}
    >
      {BiensStatusEnum.options.map((status) => (
        <SelectItem key={status} textValue={status}>
          {status}
        </SelectItem>
      ))}
    </Select>
  </div>

  {/* Footer */}
  <div className="flex justify-end mt-4 gap-3">
    <Button color="danger" variant="light" onPress={handleClose}>
      Annuler
    </Button>
    <Button
      color="primary"
      type="submit"
      disabled={biensCreatePending || !isValid}
      isLoading={biensCreatePending}
    >
      Ajouter
    </Button>
  </div>
</form>

      )}
    </div>
  );
}
