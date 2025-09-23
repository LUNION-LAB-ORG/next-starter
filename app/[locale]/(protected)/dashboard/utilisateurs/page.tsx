import React from "react";
import Content from "@/components/primitives/Content";
import Title from "@/components/primitives/Title";
import { UtilisateurList } from "@/components/(protected)/dashboard/utilisateurs/utilisateur-list";
import { prefetchUtilisateursListQuery } from "@/features/utilisateur/queries/utilisateur-list.query";

export default async function UtilisateursPage() {
  await prefetchUtilisateursListQuery({ page: 1, limit: 5 });
  return (
    <Content>
      <Title>Utilisateurs</Title>
      <UtilisateurList />
    </Content>
  );
}
