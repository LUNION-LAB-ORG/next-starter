import {
  ColumnDef,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useQueryStates } from "nuqs";
import { useCallback, useMemo, useState } from "react";
import { biensFiltersClient } from "../filters/biens.filters";
import { useBiensListQuery } from "../queries/biens-list.query";
import { IBien, IBiensParams } from "../types/biens.type";

export interface IBiensListTableProps {
  columns: ColumnDef<IBien>[];
}

export function useBiensListTable({ columns }: IBiensListTableProps) {
  // États pour le tri et la visibilité des colonnes et la sélection des lignes
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [currentBien, setCurrentBien] = useState<IBien | null>(null);

  // Gestion des paramètres d'URL via Nuqs
  const [filters, setFilters] = useQueryStates(
    biensFiltersClient.filter,
    biensFiltersClient.option,
  );

  // Construction des paramètres de recherche
  const currentSearchParams: IBiensParams = useMemo(() => {
    return {
      page: filters.page,
      limit: filters.limit,
      title: filters.title,
      cityId: filters.cityId,
      listingType: filters.listingType,
    };
  }, [filters]);

  const handleDeleteBien = useCallback((bien: IBien) => {
    setCurrentBien((prev) => bien);
    setDeleteOpen(true);
  }, []);

  // Récupération des données avec options React Query optimisées
  const { data, isLoading, isError, isFetching, error } =
    useBiensListQuery(currentSearchParams);

  const handleFilterChange = useCallback(
    (updatedFilters: Partial<IBiensParams>) => {
      void setFilters((prev) => ({
        ...prev,
        ...updatedFilters,
        page: 1,
      }));
    },
    [setFilters],
  );

  const biens = data?.data || [];
  const totalPages = data?.pagination?.pages || 1;

  // Configuration de TanStack Table
  const table = useReactTable({
    data: biens,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    manualPagination: true,
    pageCount: totalPages,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      pagination: {
        pageIndex: (filters.page || 1) - 1,
        pageSize: filters.limit || 10,
      },
    },
    onPaginationChange: (updater) => {
      const newState =
        typeof updater === "function"
          ? updater(table.getState().pagination)
          : updater;
      setFilters((prev) => ({
        ...prev,
        page: newState.pageIndex + 1,
        limit: newState.pageSize,
      }));
    },
    meta:{
      onDelete: handleDeleteBien,
    },
  });

  return {
    table,
    isLoading,
    error,
    isError,
    isFetching,
    pagination: {
      page: data?.pagination.page || 1,
      limit: data?.pagination.limit || 10,
      total: data?.pagination.total || 0,
      totalPages: data?.pagination.pages || 1,
    },
    handleFilterChange,
    filters,
    modalStates: {
      deleteOpen,
    },
    modalHandlers: {
      setDeleteOpen,
      setCurrentBien,
      handleDeleteBien,
    },
    currentBien,
  };
}
