import { useCategoryListQuery } from "@/features/categorie/queries/category-list.query";
import { useVillesListQuery } from "@/features/villes/queries/villes-list.query";
import { useAjouterVillesMutation } from "@/features/villes/queries/villes-add.mutation";
import { useGenericFileUpload } from "./use-generic-file-upload";
import { useAjouterCategoryMutation } from "@/features/categorie/queries/category-add.mutation";
import { useAmenitiesListQuery } from "@/features/biens/queries/amenities-list.query";
import React, { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { IBien } from "@/features/biens/types/biens.type";
import { FileMetadata } from "@/hooks/use-file-upload";

type useBienFormProps = {
  form: UseFormReturn<any>;
  bien?: IBien;
};

export default function useBienForm({ form, bien }: useBienFormProps) {
  const uploadLimit = {
    cover: { maxFiles: 1, maxSize: 10 }, // 10Mb
    images: { maxFiles: 25, maxSize: 10 }, // 10Mb
    video: { maxFiles: 1, maxSize: 50 }, // 50Mb
  };

  const mapMediaToFilesMetadata = React.useCallback(
    (media: IBien["medias"]): FileMetadata[] => {
      if (!media) return [];
      return media.map((m) => {
        const type = getFileType(m.url);
        const name = getNameFromUrl(m.url);
        return {
          id: m.id,
          url: m.url,
          name,
          size: m.sizeBytes,
          type,
        };
      });
    },
    [bien],
  );

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

  useEffect(() => {
    if (bien?.medias && bien.medias.length > 0) {
      const allFiles = mapMediaToFilesMetadata(bien.medias);

      // Cover (premier média)
      if (allFiles[0]) {
        coverUpload.setFiles([allFiles[0]]);
      }

      // Images et vidéos (le reste)
      const remainingFiles = allFiles.slice(1);
      const imageFiles = remainingFiles.filter((f) =>
        f.type.startsWith("image/"),
      );
      const videoFiles = remainingFiles.filter((f) =>
        f.type.startsWith("video/"),
      );

      if (imageFiles.length > 0) {
        imagesUpload.setFiles(imageFiles);
      }

      if (videoFiles.length > 0) {
        videosUpload.setFiles(videoFiles);
      }
    }
  }, [bien?.medias, mapMediaToFilesMetadata]);

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
  useEffect(() => {
    if (coverUpload.files.length > 0) {
      form.setValue("coverImage", coverUpload.files[0].file);
    }
  }, [coverUpload.files, form]);

  // Synchroniser images avec les fichiers uploadés
  useEffect(() => {
    if (imagesUpload.files.length > 0) {
      form.setValue(
        "images",
        imagesUpload.files.map((f) => f.file),
      );
    }
  }, [imagesUpload.files, form]);

  // Synchroniser video avec les fichiers uploadés
  useEffect(() => {
    if (videosUpload.files.length > 0) {
      form.setValue("video", videosUpload.files[0].file);
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

const getFileType = (url: string): string => {
  const extension = url.split(".").pop()?.toLowerCase();
  if (!extension) return "application/octet-stream";
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp"];
  const videoExtensions = ["mp4", "avi", "mov", "wmv", "flv", "mkv"];
  if (imageExtensions.includes(extension)) return "image/" + extension;
  if (videoExtensions.includes(extension)) return "video/" + extension;
  return "application/octet-stream";
};
const getNameFromUrl = (url: string): string => {
  return url.split("/").pop() || "unknown";
};
