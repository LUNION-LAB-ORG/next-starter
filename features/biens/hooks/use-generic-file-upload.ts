import { FileMetadata, useFileUpload } from "@/hooks/use-file-upload";

export function useGenericFileUpload({
  multiple,
  maxFiles,
  maxSize,
  accept,
  initialFiles = [],
}: {
  multiple: boolean;
  maxFiles: number;
  maxSize: number;
  accept: string;
  initialFiles?: (File | FileMetadata)[];
}) {
  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      clearFiles,
      getInputProps,
      setFiles,
    },
  ] = useFileUpload({
    multiple,
    maxFiles,
    maxSize,
    initialFiles,
    accept,
  });

  return {
    files,
    isDragging,
    errors,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    openFileDialog,
    removeFile,
    clearFiles,
    getInputProps,
    setFiles,
  };
}
