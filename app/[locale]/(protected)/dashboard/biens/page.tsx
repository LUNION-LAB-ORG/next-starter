import React from "react";
import { UtilisateurList } from "@/components/(protected)/dashboard/utilisateurs/utilisateur-list";
import { prefetchUtilisateursListQuery } from "@/features/utilisateur/queries/utilisateur-list.query";
import { BiensList } from "@/components/(protected)/dashboard/biens/biens-list";

export default async function BiensPage() {
  await prefetchUtilisateursListQuery({ page: 1, limit: 5 });
  return <BiensList />;
}
