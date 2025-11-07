"use client";

import { IBiens } from "@/features/biens/types/biens.type";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Button,
  Chip,
  Image,
} from "@heroui/react";
import { Edit, Trash2 } from "lucide-react";
import { useState } from "react";

interface BiensTableProps {
  data: IBiens[];
  onEdit: (bien: IBiens) => void;
  onDelete: (bien: IBiens) => void; // ✅ Corrigé : reçoit le bien complet
}

export default function BiensTable({ data, onEdit, onDelete }: BiensTableProps) {
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  // Pagination
  const pages = Math.ceil(data.length / rowsPerPage);
  const items = data.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <div className="w-full overflow-x-auto">
      <Table aria-label="Liste des biens">
        <TableHeader>
          <TableColumn>Titre</TableColumn>
          <TableColumn>Type</TableColumn>
          <TableColumn>Prix</TableColumn>
          <TableColumn>Ville</TableColumn>
          <TableColumn>Statut</TableColumn>
          <TableColumn>Image</TableColumn>
          <TableColumn>Actions</TableColumn>
        </TableHeader>

        <TableBody emptyContent="Aucun bien trouvé.">
          {items.map((bien) => (
            <TableRow key={bien.id}>
              <TableCell className="font-medium">{bien.title}</TableCell>
              <TableCell>{bien.listingType}</TableCell>
              <TableCell>
                {bien.price} {bien.currency || ""}
              </TableCell>
              <TableCell>{bien.cityId}</TableCell>
              <TableCell>
                <Chip
                  color={bien.status === "AVAILABLE" ? "success" : "warning"}
                  variant="flat"
                >
                  {bien.status}
                </Chip>
              </TableCell>
              <TableCell>
                {bien.images?.[0] ? (
                  <Image
                    src={bien.images[0]}
                    alt={bien.title}
                    width={60}
                    height={60}
                    className="rounded-md object-cover"
                  />
                ) : (
                  <span className="text-gray-400 text-sm">—</span>
                )}
              </TableCell>
              <TableCell className="flex gap-2">
                {/* ✏️ Bouton Modifier */}
                <Button
                  isIconOnly
                  color="primary"
                  variant="flat"
                  size="sm"
                  onPress={() => onEdit(bien)}
                >
                  <Edit size={16} />
                </Button>

                {/* 🗑️ Bouton Supprimer */}
                <Button
                  isIconOnly
                  color="danger"
                  variant="flat"
                  size="sm"
                  onPress={() => onDelete(bien)} // ✅ envoie tout le bien
                >
                  <Trash2 size={16} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex justify-center mt-4">
          <Pagination
            total={pages}
            page={page}
            onChange={setPage}
            color="primary"
          />
        </div>
      )}
    </div>
  );
}
