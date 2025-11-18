"use client";

import React from "react";
import { Spinner } from "@heroui/react";
import BiensTable from "@/components/(protected)/dashboard/liste-de-biens/biens-table";
import { useBiensListQuery } from "@/features/biens/queries/biens-list.query";
import { IBien, IBiensParams } from "@/features/biens/types/biens.type";
import { BiensUpdateModal } from "../biens/biens-modal/biens-update-modal";
import { BienDeleteModal } from "../biens/biens-modal/bien-delete-modal";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

const BiensListTable = () => {
  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Liste des biens</h1>
        <Button asChild>
          <Link
            href="/dashboard/biens/creer"
          >
            Ajouter un bien
          </Link>
        </Button>
      </div>
      <BiensTable />
    </div>
  );
};

export default BiensListTable;
