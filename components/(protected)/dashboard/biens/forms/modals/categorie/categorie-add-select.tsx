import React from "react";
import {
  SelectWithAddButton,
  SelectWithAddButtonProps,
} from "@/components/(protected)/dashboard/biens/forms/select-with-add-buttons";
import { ICategory } from "@/features/categorie/types/categorie.type";
import CategorieAddSheet from "@/components/(protected)/dashboard/biens/forms/modals/categorie/categorie-add-sheet";
import { CreateCategoryDTO } from "@/features/categorie/schema/categorie.schema";
import { useAjouterCategoryMutation } from "@/features/categorie/queries/category-add.mutation";
import { useQueryClient } from "@tanstack/react-query";

interface CategorieAddSelectProps {
  value: SelectWithAddButtonProps["value"];
  onValueChange: SelectWithAddButtonProps["onValueChange"];
  disabled: boolean;
  loading: boolean;
  categories?: ICategory[];
}

function CategorieAddSelect(props: CategorieAddSelectProps) {
  const [openAddCategorie, setOpenAddCategorie] = React.useState(false);
  const queryClient = useQueryClient();
  const { mutateAsync: categorieCreateMutation, isPending: categorieCreatePending } =
    useAjouterCategoryMutation();

  const handleCreateCategorie = async (data: CreateCategoryDTO) => {
    try {
      const newCategorie = await categorieCreateMutation(data);

      // ✅ Invalider le cache pour refetch les catégories
      await queryClient.invalidateQueries({ queryKey: ["category"] });

      // ✅ Attendre un cycle de rendu pour que la liste soit mise à jour
      setTimeout(() => {
        props.onValueChange(String(newCategorie.id));
        setOpenAddCategorie(false);
      }, 100);
    } catch (error) {
      console.error("Erreur lors de la création de la catégorie:", error);
    }
  };

  return (
    <>
      <SelectWithAddButton
        value={props.value}
        onValueChange={props.onValueChange}
        options={
          props.categories?.map((categorie) => ({
            id: categorie.id,
            name: categorie.label,
          })) ?? []
        }
        placeholder="Type de bien"
        label="Catégories de bien"
        disabled={props.disabled}
        loading={props.loading}
        onAddClick={() => setOpenAddCategorie(true)}
        addButtonTooltip="Ajouter une nouvelle catégorie"
      />
      <CategorieAddSheet
        open={openAddCategorie}
        onOpenChange={setOpenAddCategorie}
        createCategorieCallback={(data) => {
          handleCreateCategorie(data);
        }}
      />
    </>
  );
}

export default CategorieAddSelect;

