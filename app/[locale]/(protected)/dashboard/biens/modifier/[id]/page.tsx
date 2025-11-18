import React from "react";
import { prefetchBienDetailQuery } from "@/features/biens/queries/biens-detail.query";
import { BienUpdateForm } from "@/components/(protected)/dashboard/biens/forms/bien-update-form";

async function ModifierBienPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  void prefetchBienDetailQuery(id);
  return <BienUpdateForm bienId={id} />;
}

export default ModifierBienPage;
