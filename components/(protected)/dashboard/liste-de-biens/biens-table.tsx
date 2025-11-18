"use client";

import { Loader2, Search } from "lucide-react";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { flexRender } from "@tanstack/react-table";
import { useBiensListTable } from "@/features/biens/hooks/useBiensListTable";
import { bienTableColumns } from "@/components/(protected)/dashboard/biens/biens-list/bien-table-columns";
import { Card, CardBody } from "@heroui/react";
import TablePagination from "@/components/(protected)/dashboard/liste-de-biens/table-pagination";
import { CardHeader } from "@/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { BienDeleteModal } from "@/components/(protected)/dashboard/biens/biens-modal/bien-delete-modal";

export default function BiensTable() {
  const {
    table,
    isLoading,
    isError,
    error,
    isFetching,
    pagination,
    handleFilterChange,
    filters,
    modalStates,
    modalHandlers,
    currentBien,
  } = useBiensListTable({
    columns: bienTableColumns,
  });

  return (
    <>
      <Card>
        <CardHeader className="flex items-center justify-between py-4">
          <h1 className="text-xl font-semibold">Liste des biens</h1>
          <InputGroup className="max-w-sm">
            <InputGroupInput
              type="text"
              placeholder="Rechercher un bien..."
              value={filters.title}
              onChange={(e) => handleFilterChange({ title: e.target.value })}
            />
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
          </InputGroup>
        </CardHeader>
        <CardBody>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // État de chargement initial
                <TableRow>
                  <TableCell
                    colSpan={bienTableColumns.length}
                    className="h-24 text-center"
                  >
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-6 w-6 animate-spin mr-2" />
                      Chargement des données...
                    </div>
                  </TableCell>
                </TableRow>
              ) : isError ? (
                // État d'erreur
                <TableRow>
                  <TableCell
                    colSpan={bienTableColumns.length}
                    className="h-24 text-center"
                  >
                    <div className="text-destructive">
                      Erreur lors du chargement des données
                      {error?.message && `: ${error.message}`}
                    </div>
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows?.length ? (
                // Données chargées
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className={isFetching ? "opacity-70" : ""}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                // Aucun résultat
                <TableRow>
                  <TableCell
                    colSpan={bienTableColumns.length}
                    className="h-24 text-center"
                  >
                    Aucun résultat trouvé
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardBody>

        {/* Pagination */}
        {pagination.totalPages > 1 && <TablePagination table={table} />}
      </Card>
      {currentBien && (
        <BienDeleteModal
          isOpen={modalStates.deleteOpen}
          bien={currentBien}
          onClose={() => {
            modalHandlers.setDeleteOpen(false)
            modalHandlers.setCurrentBien(null)
          }}
        />
      )}
    </>
  );
}
