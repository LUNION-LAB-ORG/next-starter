"use client";

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
} from "@heroui/react";
import { useEffect, useCallback, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UtilisateurRoleSchema,
  UtilisateurRoleDTO,
} from "@/features/utilisateur/schema/utilisateur.schema";
import {
  IUtilisateur,
  UtilisateurRole,
} from "@/features/utilisateur/types/utilisateur.type";
import { getEnumValues } from "@/utils/getEnumValues";
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
  const { mutateAsync, isPending } =
    useModifierProfilMutation();

  const roleOptions = useMemo(() => getEnumValues(UtilisateurRole), []);
  const modalRef = useRef<HTMLDivElement>(null);

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
      await mutateAsync({ id: utilisateur?.id || "", data });
      handleClose();
    },
    [mutateAsync, handleClose, utilisateur]
  );

  useEffect(() => {
    if (!isOpen) return;

    const formValues = utilisateur
      ? { role: utilisateur.role }
      : { role: undefined };

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
    <Modal ref={modalRef} className="overflow-visible" isOpen={isOpen} onOpenChange={setIsOpen}>
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader className="flex flex-col gap-1">
            <h1 className="text-lg font-medium text-primary">
              {`Modifier ${utilisateur?.firstName} ${utilisateur?.lastName}`}
            </h1>
            <p className="text-sm text-gray-500">
              Formulaire pour modifier le rôle d&apos;un utilisateur.
            </p>
          </ModalHeader>

          <ModalBody>
            <Select
              popoverProps={{
                portalContainer: modalRef.current ?? undefined,
                shouldCloseOnScroll: false,
              }}
              defaultSelectedKeys={
                utilisateur?.role ? [utilisateur.role] : []
              }
              onSelectionChange={(keys) => {
                const value = Array.from(keys)[0] as string;
                handleRoleChange(value);
              }}
              placeholder="Choisir un rôle"
              errorMessage={errors.role?.message}
              isInvalid={!!errors.role}
              disabled={isPending}
            >
              {roleOptions.map((role) => (
                <SelectItem key={role}>{getUtilisateurRole(role).label}</SelectItem>
              ))}
            </Select>
          </ModalBody>

          <ModalFooter>
            <Button color="danger" variant="light" onPress={handleClose}>
              Annuler
            </Button>
            <Button
              color="primary"
              type="submit"
              disabled={isPending || !isValid}
              isLoading={isPending}
            >
              Modifier
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
