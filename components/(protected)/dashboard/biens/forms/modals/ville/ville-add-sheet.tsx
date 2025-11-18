import React from "react";
import BaseFormSheet from "@/components/(protected)/dashboard/biens/forms/modals/base-form-sheet";
import VilleAddForm from "@/components/(protected)/dashboard/biens/forms/modals/ville/ville-add-form";
import { CreateVillesDTO } from "@/features/villes/schema/villes.schema";

type villeAddSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  createVilleCallback?: (data:CreateVillesDTO) => void;
};

function VilleAddSheet(props: villeAddSheetProps) {
  return (
    <BaseFormSheet open={props.open} onOpenChange={props.onOpenChange}>
      <VilleAddForm
        onSubmit={props.createVilleCallback}
        onCancel={() => props.onOpenChange(false)} />
    </BaseFormSheet>
  );
}

export default VilleAddSheet;