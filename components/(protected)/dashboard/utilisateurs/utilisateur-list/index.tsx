"use client";

import { IUtilisateur } from "@/features/utilisateur/types/utilisateur.type";
import {
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { flexRender, Table as ReactTable } from "@tanstack/react-table";

export function UtilisateurList({table, isLoading, isError, isFetching}: {table: ReactTable<IUtilisateur>, isLoading: boolean, isError: boolean, isFetching: boolean}) {

  return (
    <div className="relative">
        <Table
          classNames={{
            wrapper: isFetching
              ? "opacity-50 bg-primary-50/50 transition-opacity duration-200"
              : "",
            table: isFetching ? "pointer-events-none" : "",
          }}
          bottomContent={
            <div className="flex w-full justify-center">
              <Pagination
                isCompact
                showControls
                showShadow
                page={table.getState().pagination.pageIndex + 1}
                total={table.getPageCount()}
                onChange={(page) => table.setPageIndex(page - 1)}
              />
            </div>
          }
          aria-label="Tableau des utilisateurs"
        >
          <TableHeader>
            {table
              .getHeaderGroups()[0]
              ?.headers.map((header) => (
                <TableColumn key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableColumn>
              )) || []}
          </TableHeader>
          <TableBody
            items={
              isLoading || isError || !table.getRowModel().rows?.length
                ? []
                : table.getRowModel().rows
            }
            loadingContent="Chargement..."
            emptyContent="Aucun résultat trouvé"
          >
            {(row) => (
              <TableRow key={row.id} className={isFetching ? "opacity-70" : ""}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
  );
}
