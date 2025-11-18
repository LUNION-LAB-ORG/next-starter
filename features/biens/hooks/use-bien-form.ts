import { useCategoryListQuery } from "@/features/categorie/queries/category-list.query";
import { useVillesListQuery } from "@/features/villes/queries/villes-list.query";
import { useAjouterVillesMutation } from "@/features/villes/queries/villes-add.mutation";
import { useGenericFileUpload } from "./use-generic-file-upload";
import { useAjouterCategoryMutation } from "@/features/categorie/queries/category-add.mutation";
import { useAmenitiesListQuery } from "@/features/biens/queries/amenities-list.query";
import React from "react";
import { UseFormReturn } from "react-hook-form";

export default function useBienForm({ form }: { form: UseFormReturn<any> }) {
  const [openAddCategory, setOpenAddCategory] = React.useState(false);
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

  const { mutateAsync: villesCreateMutation, isPending: villesCreatePending } =
    useAjouterVillesMutation();

  const {
    mutateAsync: categoriesCreateMutation,
    isPending: categoriesCreatePending,
  } = useAjouterCategoryMutation();

  // Synchroniser coverImage avec les fichiers uploadés
  React.useEffect(() => {
    if (coverUpload.files.length > 0) {
      form.setValue("coverImage", coverUpload.files[0].file as File);
    }
  }, [coverUpload.files, form]);

  // Synchroniser images avec les fichiers uploadés
  React.useEffect(() => {
    if (imagesUpload.files.length > 0) {
      form.setValue(
        "images",
        imagesUpload.files.map((f) => f.file as File),
      );
    }
  }, [imagesUpload.files, form]);

  // Synchroniser video avec les fichiers uploadés
  React.useEffect(() => {
    if (videosUpload.files.length > 0) {
      form.setValue("video", videosUpload.files[0].file as File);
    }
  }, [videosUpload.files, form]);

  const { data: amenities, isLoading: amenitiesLoading } =
    useAmenitiesListQuery();

  return {
    coverUpload,
    imagesUpload,
    videosUpload,
    uploadLimit,
    amenities,
    amenitiesLoading,
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
