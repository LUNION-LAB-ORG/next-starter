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
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UtilisateurUpdateDTO,
  UtilisateurUpdateSchema,
} from "@/features/utilisateur/schema/utilisateur.schema";
import {
  IUtilisateur,
  UtilisateurRole,
} from "@/features/utilisateur/types/utilisateur.type";
import { getEnumValues } from "@/utils/getEnumValues";
import { useModifierProfilMutation } from "@/features/utilisateur/queries/utilisateur-update.mutation";
import { getUtilisateurRole } from "@/features/utilisateur/utils/getUtilisateurRole";
import { Input } from "@heroui/input";

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
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
  } = useForm<UtilisateurUpdateDTO>({
    resolver: zodResolver(UtilisateurUpdateSchema),
    mode: "onChange",
  });

  const handleClose = useCallback(() => {
    if (!isPending) {
      setIsOpen(false);
      setTimeout(() => reset({ role: undefined }), 200);
    }
  }, [isPending, setIsOpen, reset]);

  const onSubmit = useCallback(
    async (data: UtilisateurUpdateDTO) => {
      const payload: Partial<UtilisateurUpdateDTO> = { ...data };
      if (!payload.password) delete payload.password;
      if (!payload.phone) delete payload.phone;
      await modifierProfilMutation({
        id: utilisateur?.id || "",
        data: payload,
      });
      handleClose();
    },
    [modifierProfilMutation, handleClose, utilisateur],
  );

  useEffect(() => {
    if (!isOpen) return;

    const formValues = utilisateur
      ? {
          fullname: utilisateur.fullname,
          email: utilisateur.email,
          role: utilisateur.role,
          phone: utilisateur.phone || "",
          password: "",
        }
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
    [setValue],
  );

  return (
    <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader className="flex flex-col gap-1">
            <h1 className="text-lg font-medium text-primary">
              {`Modifier ${utilisateur?.fullname}`}
            </h1>
            <p className="text-sm text-gray-500">
              Formulaire pour modifier un utilisateur
            </p>
          </ModalHeader>

          <ModalBody>
            <Input
              {...register("fullname")}
              isInvalid={!!errors.fullname}
              errorMessage={errors.fullname?.message}
              disabled={isPending}
              placeholder="Nom complet"
              variant="bordered"
              type="text"
            />
            <Input
              {...register("email")}
              isInvalid={!!errors.email}
              errorMessage={errors.email?.message}
              disabled={isPending}
              placeholder="Email"
              variant="bordered"
              type="email"
            />
            <Input
              {...register("phone")}
              isInvalid={!!errors.phone}
              errorMessage={errors.phone?.message}
              disabled={isPending}
              placeholder="Téléphone (optionnel)"
              variant="bordered"
              type="tel"
            />
            <Select
              selectedKeys={[watch("role")?.toString() || ""]}
              onChange={(e) => handleRoleChange(e.target.value)}
              errorMessage={errors.role?.message}
              isInvalid={!!errors.role}
              disabled={isPending}
              placeholder="Choisir un rôle"
              variant="bordered"
            >
              {roleOptions.map((role) => (
                <SelectItem key={role}>
                  {getUtilisateurRole(role).label}
                </SelectItem>
              ))}
            </Select>
            <Input
              {...register("password")}
              isInvalid={!!errors.password}
              errorMessage={errors.password?.message}
              disabled={isPending}
              placeholder="Nouveau mot de passe (laisser vide pour ne pas changer)"
              variant="bordered"
              type={showPassword ? "text" : "password"}
              endContent={
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="text-xs text-primary underline"
                >
                  {showPassword ? "Masquer" : "Afficher"}
                </button>
              }
            />
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
