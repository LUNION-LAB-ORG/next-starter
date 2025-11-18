import React from "react";
import { prefetchBienDetailQuery } from "@/features/biens/queries/biens-detail.query";
import { BienCreateForm } from "@/components/(protected)/dashboard/biens/forms/bien-create-form";

async function ModifierBienPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  void prefetchBienDetailQuery(id);
  return <BienCreateForm bienId={id} mode="edit" />;
}

export default ModifierBienPage;
