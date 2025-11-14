import React from "react";
import { UtilisateurList } from "@/components/(protected)/dashboard/utilisateurs/utilisateur-list";
import { prefetchUtilisateursListQuery } from "@/features/utilisateur/queries/utilisateur-list.query";
import { BienForm } from "@/components/(protected)/dashboard/biens/bien-form";

export default async function BiensPage() {
  await prefetchUtilisateursListQuery({ page: 1, limit: 5 });
  return <BienForm />;
}
