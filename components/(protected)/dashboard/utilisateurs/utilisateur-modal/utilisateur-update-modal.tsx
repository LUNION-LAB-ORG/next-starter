"use client";

import { useEffect, useCallback, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UtilisateurRoleSchema,
  UtilisateurRoleDTO,
} from "@/features/utilisateur/schema/utilisateur.schema";
import { IUtilisateur, UtilisateurRole } from "@/features/utilisateur/types/utilisateur.type";
import { getEnumValues } from "@/utils/getEnumValues";
import { Button } from "@/components/ui/button";
import { useModifierProfilMutation } from "@/features/utilisateur/queries/utilisateur-update.mutation";
import { getUtilisateurRole } from "@/features/utilisateur/utils/getUtilisateurRole";

type Props = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  utilisateur: IUtilisateur | null;
};

export function UtilisateurUpdateModal({
  isOpen,
  setIsOpen,
  utilisateur,
}: Props) {
  const { mutateAsync: modifierProfilMutation, isPending } =
    useModifierProfilMutation();

  const roleOptions = useMemo(() => getEnumValues(UtilisateurRole), []);

  const {
    setValue,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
  } = useForm<UtilisateurRoleDTO>({
    resolver: zodResolver(UtilisateurRoleSchema),
    mode: "onChange",
  });

  const handleClose = useCallback(() => {
    if (!isPending) {
      setIsOpen(false);
      setTimeout(() => reset({ role: undefined }), 200);
    }
  }, [isPending, setIsOpen, reset]);

  const onSubmit = useCallback(
    async (data: UtilisateurRoleDTO) => {
      await modifierProfilMutation({ id: utilisateur?.id || "", data });
      handleClose();
    },
    [modifierProfilMutation, handleClose, utilisateur]
  );

  useEffect(() => {
    if (!isOpen) return;

    const formValues = utilisateur
      ? {
          role: utilisateur.role,
        }
      : {
          role: undefined,
        };

    reset(formValues);
  }, [isOpen, utilisateur, reset]);

  const handleRoleChange = useCallback(
    (value: string) => {
      setValue("role", value as UtilisateurRole, {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
    [setValue]
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-medium text-gray-900 mb-4">
            {`Modifier ${utilisateur?.firstName} ${utilisateur?.lastName}`}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Formulaire pour modifier le rôle d'un utilisateur.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Select
              value={watch("role")?.toString() || ""}
              onValueChange={handleRoleChange}
              disabled={isPending}
            >
              <SelectTrigger
                className={`w-full ${errors.role ? "border-red-500" : ""}`}
              >
                <SelectValue placeholder="Choisir un rôle" />
              </SelectTrigger>
              <SelectContent>
                {roleOptions.map((role) => (
                  <SelectItem key={role} value={role.toString()}>
                    {getUtilisateurRole(role)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="text-sm text-red-500 mt-1">{errors.role.message}</p>
            )}
          </div>

          <DialogFooter className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isPending}
              className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isPending || !isValid}
              className="px-4 py-2 text-sm text-white bg-primary rounded-md hover:bg-primary/90 disabled:opacity-50"
            >
              {isPending ? "Modification..." : "Modifier"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
