"use client";

import Content from "@/components/primitives/Content";
import React from "react";
import VilleModal from "@/components/(protected)/dashboard/biens/ville-modal";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon } from "@/components/ui/input-group";
import NumericInput from "@/components/ui/numeric-input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { EditorField } from "@/components/(protected)/dashboard/biens/editor-field";
import { EditorState } from "lexical";
import useBienForm from "@/features/biens/hooks/use-bien-form";
import MapField from "@/components/common/map-field";
import FileUploadView from "@/components/block/file-upload-view";
import {
  BienAddDTO,
  BiensAddSchema,
} from "@/features/biens/schema/biens.schema";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import CommoditeCombobox from "@/components/(protected)/dashboard/biens/commodite-combobox";
import AddButton from "@/components/(protected)/dashboard/biens/add-button";
import { useAjouterBiensMutation } from "@/features/biens/queries/biens-add.mutation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SelectWithAddButton } from "@/components/(protected)/dashboard/biens/forms/select-with-add-buttons";
import VilleAddSelect from "@/components/(protected)/dashboard/biens/forms/modals/ville/ville-add-select";
import CategorieAddSelect from "@/components/(protected)/dashboard/biens/forms/modals/categorie/categorie-add-select";

export function BienCreateForm() {
  const form = useForm<BienAddDTO>({
    resolver: zodResolver(BiensAddSchema),
    mode: "onSubmit",
    defaultValues: {
      title: "moana",
      categoryId: "",
      listingType: "RENT",
      price: "2000",
      secondaryPrice: "500",
      currency: "XOF",
      pricePeriod: "MONTH",
      cityId: "",
      area: "250",
      landArea: "500",
      rooms: 5,
      bedrooms: 2,
      bathrooms: 2,
      garages: 1,
      garageCapacity: 20,
      yearBuilt: 2020,
      addressLine1: "Résidence La Palmeraie, Rue J74, Zone 4C, Marcory",
      addressLine2: "Appartement 2 chambres, à 200 m du carrefour Prima Center",
      amenities: [],
      images: [],
      video: undefined,
      coverImage: undefined,
    },
  });

  const {
    coverUpload,
    imagesUpload,
    videosUpload,
    uploadLimit,
    villeInput,
    categoryInput,
    amenities,
  } = useBienForm({ form });

  const {
    data: villes,
    isLoading: villesLoading,
    villesCreatePending,
  } = villeInput;
  const {
    data: categories,
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = categoryInput;

  const { mutateAsync: biensCreateMutation, isPending: biensCreatePending } =
    useAjouterBiensMutation();

  async function onSubmit(values: BienAddDTO) {
    toast.promise(biensCreateMutation(values), {
      loading: "Ajout du bien immobilier en cours...",
      success: "Bien immobilier ajouté avec succès !",
      error: "Une erreur est survenue lors de l'ajout du bien immobilier.",
    });

    form.reset();
    coverUpload.clearFiles();
    imagesUpload.clearFiles();
    videosUpload.clearFiles();
  }

  return (
    <Content>
      <h1 className="text-xl font-semibold text-primary mb-6">
        Ajouter un bien immobilier
      </h1>
      <div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-5 gap-4"
          >
            <fieldset disabled={biensCreatePending} className="contents">
              <FormField
                control={form.control}
                name="coupDeCoeur"
                render={({ field }) => (
                  <FormItem className="col-span-full flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Label className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-pink-600 has-[[aria-checked=true]]:bg-pink-50 dark:has-[[aria-checked=true]]:border-pink-900 dark:has-[[aria-checked=true]]:bg-pink-950">
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:border-pink-600 data-[state=checked]:bg-pink-600 data-[state=checked]:text-white dark:data-[state=checked]:border-pink-700 dark:data-[state=checked]:bg-pink-700"
                        />
                        <div className="grid gap-1.5 font-normal">
                          <p className="text-sm leading-none font-medium">
                            Mettre en avant ce bien comme{" "}
                            <strong>Coup de Coeur</strong>
                          </p>
                        </div>
                      </Label>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Titre du bien</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prix</FormLabel>
                    <FormControl>
                      <InputGroup>
                        <NumericInput
                          data-slot="input-group-control"
                          className="flex-1 rounded-none border-0 bg-transparent shadow-none focus-visible:ring-0 dark:bg-transparent text-right"
                          {...field}
                        />
                        <InputGroupAddon align="inline-end">
                          <span className="text-sm font-medium">CFA</span>
                        </InputGroupAddon>
                      </InputGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="secondaryPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prix promo</FormLabel>
                    <FormControl>
                      <InputGroup>
                        <NumericInput
                          data-slot="input-group-control"
                          className="flex-1 rounded-none border-0 bg-transparent shadow-none focus-visible:ring-0 dark:bg-transparent text-right"
                          {...field}
                        />
                        <InputGroupAddon align="inline-end">
                          <span className="text-sm font-medium">CFA</span>
                        </InputGroupAddon>
                      </InputGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="listingType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type de transaction</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Catégories de bien</SelectLabel>
                            <SelectItem value="SALE">Vente</SelectItem>
                            <SelectItem value="RENT">Location</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pricePeriod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Période de facturation</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={form.watch("listingType") === "SALE"}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Période de facturation</SelectLabel>
                            <SelectItem value="DAY">Par jour</SelectItem>
                            <SelectItem value="WEEK">Par semaine</SelectItem>
                            <SelectItem value="MONTH">Par mois</SelectItem>
                            <SelectItem value="YEAR">Par an</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Catégories de bien</FormLabel>
                    <FormControl>
                      <CategorieAddSelect
                        value={field.value}
                        onValueChange={field.onChange}
                        categories={categories}
                        disabled={categoriesError}
                        loading={categoriesLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cityId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ville</FormLabel>
                    <FormControl>
                      <VilleAddSelect
                        value={field.value}
                        onValueChange={field.onChange}
                        villes={villes}
                        disabled={villesLoading || villesCreatePending}
                        loading={villesLoading || villesCreatePending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="area"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Surface habitable</FormLabel>
                    <FormControl>
                      <InputGroup>
                        <NumericInput
                          data-slot="input-group-control"
                          className="flex-1 rounded-none border-0 bg-transparent shadow-none focus-visible:ring-0 dark:bg-transparent text-right"
                          {...field}
                        />
                        <InputGroupAddon align="inline-end">
                          <span className="text-sm font-medium">
                            m<sup>2</sup>
                          </span>
                        </InputGroupAddon>
                      </InputGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="landArea"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Surface du terrain</FormLabel>
                    <FormControl>
                      <InputGroup>
                        <NumericInput
                          data-slot="input-group-control"
                          className="flex-1 rounded-none border-0 bg-transparent shadow-none focus-visible:ring-0 dark:bg-transparent text-right"
                          {...field}
                        />
                        <InputGroupAddon align="inline-end">
                          <span className="text-sm font-medium">
                            m<sup>2</sup>
                          </span>
                        </InputGroupAddon>
                      </InputGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="rooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre de pièces</FormLabel>
                    <FormControl>
                      <NumericInput {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bedrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chambres</FormLabel>
                    <FormControl>
                      <NumericInput {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bathrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Salles de bain</FormLabel>
                    <FormControl>
                      <NumericInput {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="garages"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Garages</FormLabel>
                    <FormControl>
                      <NumericInput {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="garageCapacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacité du garage</FormLabel>
                    <FormControl>
                      <NumericInput {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amenities"
                render={({ field }) => (
                  <FormItem className="col-span-3">
                    <FormLabel>Commodités</FormLabel>
                    <FormControl>
                      <CommoditeCombobox
                        options={amenities || []}
                        selected={field.value || []}
                        onChange={field.onChange}
                        label="Sélectionner les commodités"
                        onCreateNew={(name) => {
                          // Vous pouvez ajouter une logique pour sauvegarder en base de données
                          console.log("Nouvelle commodité créée:", name);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="col-span-full">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <EditorField
                        editorSerializedState={
                          field.value
                            ? (JSON.parse(field.value) as EditorState)
                            : undefined
                        }
                        handleChange={(editorState) => {
                          field.onChange(JSON.stringify(editorState));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="addressLine1"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Adresse principale</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="addressLine2"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Adresse secondaire</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="yearBuilt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Année de construction</FormLabel>
                    <FormControl>
                      <NumericInput {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="latLong"
                render={({ field }) => (
                  <FormItem className="col-span-full">
                    <FormLabel>
                      Localisation sur la carte (cliquez pour définir la
                      position)
                    </FormLabel>
                    <FormControl>
                      <div className="h-80 bg-gray-50 relative">
                        <MapField
                          zoom={14}
                          markerPosition={
                            field.value?.lat && field.value?.lng
                              ? [
                                  Number(field.value.lat),
                                  Number(field.value.lng),
                                ]
                              : undefined
                          }
                          onPositionChange={(position) => {
                            field.onChange({
                              lat: (position as [number, number])[0],
                              lng: (position as [number, number])[1],
                            });
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="coverImage"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Image de couverture</FormLabel>
                    <FormControl>
                      <FileUploadView
                        maxFiles={uploadLimit.cover.maxFiles}
                        maxSizeMB={uploadLimit.cover.maxSize}
                        openFileDialog={coverUpload.openFileDialog}
                        handleDragEnter={coverUpload.handleDragEnter}
                        handleDragLeave={coverUpload.handleDragLeave}
                        handleDragOver={coverUpload.handleDragOver}
                        handleDrop={(e) => {
                          coverUpload.handleDrop(e);
                          field.onChange(coverUpload.files);
                        }}
                        files={coverUpload.files}
                        isDragging={coverUpload.isDragging}
                        errors={coverUpload.errors}
                        removeFile={(id) => {
                          coverUpload.removeFile(id);
                          field.onChange(
                            coverUpload.files.filter((f) => f.id !== id),
                          );
                        }}
                        clearFiles={() => {
                          coverUpload.clearFiles();
                          field.onChange([]);
                        }}
                        getInputProps={() => ({
                          ...coverUpload.getInputProps(),
                          onChange: (e) => {
                            coverUpload.getInputProps().onChange?.(e);
                            field.onChange(coverUpload.files);
                          },
                        })}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="video"
                render={({ field }) => (
                  <FormItem className="col-span-3">
                    <FormLabel>Vidéos du bien</FormLabel>
                    <FormControl>
                      <FileUploadView
                        maxFiles={uploadLimit.video.maxFiles}
                        maxSizeMB={uploadLimit.video.maxSize}
                        openFileDialog={videosUpload.openFileDialog}
                        handleDragEnter={videosUpload.handleDragEnter}
                        handleDragLeave={videosUpload.handleDragLeave}
                        handleDragOver={videosUpload.handleDragOver}
                        handleDrop={(e) => {
                          videosUpload.handleDrop(e);
                          field.onChange(videosUpload.files);
                        }}
                        files={videosUpload.files}
                        isDragging={videosUpload.isDragging}
                        errors={videosUpload.errors}
                        removeFile={(id) => {
                          videosUpload.removeFile(id);
                          field.onChange(
                            videosUpload.files.filter((f) => f.id !== id),
                          );
                        }}
                        clearFiles={() => {
                          videosUpload.clearFiles();
                          field.onChange([]);
                        }}
                        getInputProps={() => ({
                          ...videosUpload.getInputProps(),
                          onChange: (e) => {
                            videosUpload.getInputProps().onChange?.(e);
                            field.onChange(videosUpload.files);
                          },
                        })}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem className="col-span-full">
                    <FormLabel>Images du bien</FormLabel>
                    <FormControl>
                      <FileUploadView
                        maxFiles={uploadLimit.images.maxFiles}
                        maxSizeMB={uploadLimit.images.maxSize}
                        openFileDialog={imagesUpload.openFileDialog}
                        handleDragEnter={imagesUpload.handleDragEnter}
                        handleDragLeave={imagesUpload.handleDragLeave}
                        handleDragOver={imagesUpload.handleDragOver}
                        handleDrop={(e) => {
                          imagesUpload.handleDrop(e);
                          field.onChange(imagesUpload.files);
                        }}
                        files={imagesUpload.files}
                        isDragging={imagesUpload.isDragging}
                        errors={imagesUpload.errors}
                        removeFile={(id) => {
                          imagesUpload.removeFile(id);
                          field.onChange(
                            imagesUpload.files.filter((f) => f.id !== id),
                          );
                        }}
                        clearFiles={() => {
                          imagesUpload.clearFiles();
                          field.onChange([]);
                        }}
                        getInputProps={() => ({
                          ...imagesUpload.getInputProps(),
                          onChange: (e) => {
                            imagesUpload.getInputProps().onChange?.(e);
                            field.onChange(imagesUpload.files);
                          },
                        })}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </fieldset>
            <Button disabled={biensCreatePending}>
              {biensCreatePending && <Loader className="animate-spin" />}
              Ajouter le bien immobilier
            </Button>
          </form>
        </Form>
      </div>
      <VilleModal isOpen={false} onOpenChange={() => ""} />
    </Content>
  );
}
