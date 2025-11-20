"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  UtilisateurAddDTO,
  UtilisateurAddSchema,
} from "@/features/utilisateur/schema/utilisateur.schema";
import { useAjouterUtilisateurMutation } from "@/features/utilisateur/queries/utilisateur-add.mutation";
import { UtilisateurRole } from "@/features/utilisateur/types/utilisateur.type";
import { getEnumValues } from "@/utils/getEnumValues";
import { getUtilisateurRole } from "@/features/utilisateur/utils/getUtilisateurRole";

export type UtilisateurAddFormProps = {
  onSuccess?: () => void;
  onCancel?: () => void;
};

function UtilisateurAddForm({ onSuccess, onCancel }: UtilisateurAddFormProps) {
  const form = useForm<z.infer<typeof UtilisateurAddSchema>>({
    resolver: zodResolver(UtilisateurAddSchema),
    mode: "onSubmit",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      role: undefined,
    },
  });

  const { mutateAsync: ajouterUtilisateur, isPending } =
    useAjouterUtilisateurMutation();

  const roleOptions = React.useMemo(
    () => getEnumValues(UtilisateurRole),
    []
  );

  const onSubmit = async (values: UtilisateurAddDTO) => {
    await ajouterUtilisateur({ data: values });
    form.reset({
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      role: undefined,
    });
    onSuccess?.();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prénom</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Jean" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Dupont" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Ex: jean@exemple.ci" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Téléphone</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="Ex: +2250707070707" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rôle</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choisir un rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Rôle</SelectLabel>
                      {roleOptions.map((role) => (
                        <SelectItem key={role} value={role}>
                          {getUtilisateurRole(role).label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3 pt-2">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isPending}
            >
              Annuler
            </Button>
          )}
          <Button type="submit" disabled={isPending}>
            {isPending ? "Création..." : "Créer l'utilisateur"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default UtilisateurAddForm;

