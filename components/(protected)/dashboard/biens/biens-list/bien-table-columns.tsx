import { ColumnDef } from "@tanstack/react-table";
import { IBien } from "@/features/biens/types/biens.type";
import { formatCurrency } from "@/utils/numericUtils";
import BienStatusBadge from "@/components/(protected)/dashboard/biens/bien-status-badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Loader, MoreHorizontal } from "lucide-react";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";

export type BienTableColumn = ColumnDef<IBien>;

export const bienTableColumns: BienTableColumn[] = [
  {
    accessorKey: "coverMedia",
    header: "Image",
    cell: ({ row }) => {
      const coverMedia =
        row.original.coverMedia?.url.trim() ||
        row.original.medias?.[0]?.url.trim() ||
        "/images/placeholder-image.png";
      const isLoading = row.original.status === "IN_PROGRESS";
      if (isLoading) {
        return (
          <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded">
            <Loader className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        );
      }
      return (
        <Image
          src={coverMedia}
          width={64}
          height={64}
          alt={row.original.title + " cover"}
          className="rounded"
        />
      );
    },
    size: 100,
  },
  {
    accessorKey: "title",
    header: "Titre",
    cell: ({ row }) => {
      const isCoupdeCoeur = row.original.coupDeCoeur;
      return (
        <span className={cn(isCoupdeCoeur && "text-pink-600", "font-semibold")}>
          {row.original.title}
        </span>
      );
    },
  },
  {
    accessorKey: "category",
    header: "Catégorie",
    cell: ({ row }) => row.original.category?.label,
  },
  {
    accessorKey: "city",
    header: "Ville",
    cell: ({ row }) => row.original.city?.name,
  },
  {
    accessorKey: "price",
    header: "Prix",
    cell: ({ row }) => {
      const price = formatCurrency(
        row.original.price,
        row.original.currency || "XOF",
      );
      const isOnSale = row.original.listingType === "SALE";
      if (isOnSale) {
        return price;
      }
      const period = row.original.pricePeriod
        ? ` / ${row.original.pricePeriod.toLowerCase()}`
        : "";
      return price + period;
    },
  },
  {
    accessorKey: "listingType",
    header: "Type de transaction",
    cell: ({ row }) =>
      row.original.listingType === "SALE" ? "Vente" : "Location",
  },
  {
    accessorKey: "status",
    header: "Statut",
    cell: ({ row }) => <BienStatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "createdAt",
    header: "Date de création",
    cell: ({ row }) =>
      new Date(row.original.createdAt).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row, table }) => {
      const meta = table.options.meta as {
        onDelete: (bien: IBien) => void;
      };

      const bien = row.original;
      const isLoading = row.original.status === "IN_PROGRESS";
      if (isLoading) {
        return (
          <div className="flex items-center justify-center w-8 h-8">
            <Loader className="w-5 h-5 animate-spin text-gray-400" />
          </div>
        );
      }
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/biens/modifier/${bien.slug}`}>
                Modifier
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => meta.onDelete(bien)}
              variant="destructive"
            >
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
