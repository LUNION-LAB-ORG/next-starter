import React from "react";
import BaseFormSheet from "@/components/(protected)/dashboard/biens/forms/modals/base-form-sheet";
import CategorieAddForm from "@/components/(protected)/dashboard/biens/forms/modals/categorie/categorie-add-form";
import { CreateCategoryDTO } from "@/features/categorie/schema/categorie.schema";

type CategorieAddSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  createCategorieCallback?: (data: CreateCategoryDTO) => void;
};

function CategorieAddSheet(props: CategorieAddSheetProps) {
  return (
    <BaseFormSheet open={props.open} onOpenChange={props.onOpenChange}>
      <CategorieAddForm
        onSubmit={props.createCategorieCallback}
        onCancel={() => props.onOpenChange(false)}
      />
    </BaseFormSheet>
  );
}

export default CategorieAddSheet;

