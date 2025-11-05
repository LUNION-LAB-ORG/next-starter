"use client";

import Content from "@/components/primitives/Content";
import { useBiensListTable } from "@/features/biens/hooks/useBiensListTable";
import {
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { flexRender } from "@tanstack/react-table";

import { columns } from "./column";
import { HeaderFilter } from "./header-filter";

import { BiensAddModal } from "../biens-modal/biens-add-modal";
import { BiensDeleteModal } from "../biens-modal/biens-delete-modal";
import { BiensUpdateModal } from "../biens-modal/biens-update-modal";

export function BiensList() {
 
  //   table,
  //   isLoading,
  //   isError,
  //   isFetching,
  //   handleTextFilterChange,
  //   handleEnumFilterChange,
  //   modalStates,
  //   modalHandlers,
  //   currentUser,
  //   filters,
  // } = useBiensListTable({ columns });

  return (
    <Content>
      

      {/* 🧩 Modales */}
      <BiensAddModal/>

    

      
    </Content>
  );
}
