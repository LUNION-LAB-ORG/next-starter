import { useForm } from "react-hook-form";
import {
  BiensAddDTO,
  BiensAddSchema,
} from "@/features/biens/schema/biens.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCategoryListQuery } from "@/features/categorie/queries/category-list.query";
import { useVillesListQuery } from "@/features/villes/queries/villes-list.query";
import { useAjouterBiensMutation } from "@/features/biens/queries/biens-add.mutation";
import { useAjouterVillesMutation } from "@/features/villes/queries/villes-add.mutation";
import { useGenericFileUpload } from "./use-generic-file-upload";
import { useAjouterCategoryMutation } from "@/features/categorie/queries/category-add.mutation";
import { useAmenitiesListQuery } from "@/features/biens/queries/amenities-list.query";

export default function useBienForm() {
  const form = useForm<BiensAddDTO>({
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

  const uploadLimit = {
    cover: { maxFiles: 1, maxSize: 10 }, // 10Mb
    images: { maxFiles: 25, maxSize: 10 }, // 10Mb
    video: { maxFiles: 1, maxSize: 50 }, // 50Mb
  };

  const coverUpload = useGenericFileUpload({
    multiple: false,
    maxFiles: uploadLimit.cover.maxFiles,
    maxSize: uploadLimit.cover.maxSize * 1024 * 1024,
    accept: "image/*",
  });

  const imagesUpload = useGenericFileUpload({
    multiple: true,
    maxFiles: uploadLimit.images.maxFiles,
    maxSize: uploadLimit.images.maxSize * 1024 * 1024,
    accept: "image/*",
  });

  const videosUpload = useGenericFileUpload({
    multiple: false,
    maxFiles: uploadLimit.video.maxFiles,
    maxSize: uploadLimit.video.maxSize * 1024 * 1024,
    accept: "video/*",
  });

  const {
    data: villesData,
    isLoading: villesLoading,
    isError: villesError,
  } = useVillesListQuery({});

  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useCategoryListQuery({});

  const { mutateAsync: biensCreateMutation, isPending: biensCreatePending } =
    useAjouterBiensMutation();
  const { mutateAsync: villesCreateMutation, isPending: villesCreatePending } =
    useAjouterVillesMutation();

  const {
    mutateAsync: categoriesCreateMutation,
    isPending: categoriesCreatePending,
  } = useAjouterCategoryMutation();

  const { data: amenities } = useAmenitiesListQuery();

  return {
    form,
    biensCreateMutation,
    biensCreatePending,
    coverUpload,
    imagesUpload,
    videosUpload,
    uploadLimit,
    amenities,
    villeInput: {
      isLoading: villesLoading,
      isError: villesError,
      data: villesData,
      villesCreateMutation,
      villesCreatePending,
    },
    categoryInput: {
      isLoading: categoriesLoading,
      isError: categoriesError,
      data: categoriesData,
      categoriesCreateMutation,
      categoriesCreatePending,
    },
  };
}
