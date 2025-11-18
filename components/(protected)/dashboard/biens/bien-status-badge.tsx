import React from "react";
import { Badge } from "@/components/ui/badge";
import { BienStatus } from "@/features/biens/types/biens.type";
import { getBiensStatusLabel } from "@/utils/getEnumValues";
import { cn } from "@/lib/utils";

function badgeVariant(status: BienStatus) {
  switch (status) {
    case BienStatus.PUBLISHED:
      return "bg-success text-white";
    case BienStatus.DRAFT:
      return "bg-gray-500 text-white";
    case BienStatus.ARCHIVED:
      return "bg-yellow-500 text-white";
    default:
      return "bg-gray-300 text-black";
  }
}

function BienStatusBadge({ status }: { status: BienStatus }) {
  return (
    <Badge className={cn("text-sm", badgeVariant(status))}>
      {getBiensStatusLabel(status)}
    </Badge>
  );
}

export default BienStatusBadge;
