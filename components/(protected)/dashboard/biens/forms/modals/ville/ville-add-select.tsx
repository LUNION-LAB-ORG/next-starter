import React from "react";
import {
  SelectWithAddButton,
  SelectWithAddButtonProps,
} from "@/components/(protected)/dashboard/biens/forms/select-with-add-buttons";
import { IVille } from "@/features/villes/types/villes.type";
import VilleAddSheet from "@/components/(protected)/dashboard/biens/forms/modals/ville/ville-add-sheet";
import { CreateVillesDTO } from "@/features/villes/schema/villes.schema";
import { useAjouterVillesMutation } from "@/features/villes/queries/villes-add.mutation";

interface VilleAddSelectProps {
  value: SelectWithAddButtonProps["value"];
  onValueChange: SelectWithAddButtonProps["onValueChange"];
  disabled: boolean;
  loading: boolean;
  villes?: IVille[];
}

function VilleAddSelect(props: VilleAddSelectProps) {
  const [openAddVille, setOpenAddVille] = React.useState(false);
  const { mutateAsync: villesCreateMutation, isPending: villesCreatePending } =
    useAjouterVillesMutation();

  const handleCreateVille = async (data: CreateVillesDTO) => {
    const newVille = await villesCreateMutation(data);

    setTimeout(() => {
      props.onValueChange(String(newVille.id));
      setOpenAddVille(false);
    }, 1000);
  };
  return (
    <>
      <SelectWithAddButton
        value={props.value}
        onValueChange={props.onValueChange}
        options={
          props.villes?.map((ville) => ({
            id: ville.id,
            name: ville.name,
          })) ?? []
        }
        placeholder="Ville"
        label="Ville"
        disabled={props.disabled}
        loading={props.loading}
        onAddClick={() => setOpenAddVille(true)}
        addButtonTooltip="Ajouter une nouvelle ville"
      />
      <VilleAddSheet
        open={openAddVille}
        onOpenChange={setOpenAddVille}
        createVilleCallback={(data) => {
          handleCreateVille(data);
        }}
      />
    </>
  );
}

export default VilleAddSelect;
