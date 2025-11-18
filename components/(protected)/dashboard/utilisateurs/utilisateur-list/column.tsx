"use client";

import { ColumnDef } from "@tanstack/react-table";
import { SquarePen, Trash2 } from "lucide-react";

import {
  IUtilisateur,
  UtilisateurRole,
} from "@/features/utilisateur/types/utilisateur.type";
import { getUtilisateurRole } from "@/features/utilisateur/utils/getUtilisateurRole";
import { Button, Chip, Tooltip, User } from "@heroui/react";
import { formatPhoneForHuman } from "@/utils/numericUtils";

export const columns: ColumnDef<IUtilisateur>[] = [
  {
    accessorKey: "firstName",
    header: "Nom Complet",
    cell: ({ row }) => {
      const user = row.original;
      return <User name={user.fullname}>{user.email}</User>;
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <span>{row.getValue("email")}</span>,
  },
  {
    accessorKey: "phone",
    header: "Téléphone",
    cell: ({ row }) => <span>{formatPhoneForHuman(row.original.phone)}</span>,
  },
  {
    accessorKey: "role",
    header: "Rôle",
    cell: ({ row }) => {
      const role = row.getValue<UtilisateurRole>("role");
      const roleName = getUtilisateurRole(role) || "Inconnu";

      return (
        <Chip
          className="capitalize"
          color={roleName.color}
          size="sm"
          variant="flat"
        >
          {roleName.label}
        </Chip>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date de création",
    cell: ({ row }) => {
      const createdAt = new Date(row.getValue<string>("createdAt"));
      const formattedDate = createdAt.toLocaleDateString("fr-FR");
      return <span>{formattedDate}</span>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    enableHiding: false,
    cell: ({ row, table }) => {
      const user = row.original as IUtilisateur;

      const meta = table.options.meta as {
        onView: (user: IUtilisateur) => void;
        onEdit: (user: IUtilisateur) => void;
        onDelete: (user: IUtilisateur) => void;
        onLockUnlock: (user: IUtilisateur) => void;
      };

      return (
        <div className="relative flex items-center gap-2">
          <Tooltip content="Modifier">
            <Button
              variant="bordered"
              isIconOnly
              onPress={() => meta.onEdit(user)}
              size="sm"
            >
              <SquarePen className="w-4 h-4" />
            </Button>
          </Tooltip>

          <Tooltip content="Supprimer">
            <Button
              variant="bordered"
              isIconOnly
              onPress={() => meta.onDelete(user)}
              size="sm"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </Tooltip>
        </div>
      );
    },
  },
];
