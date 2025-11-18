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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  CreateVillesDTO,
  CreateVillesSchema,
} from "@/features/villes/schema/villes.schema";
import {
  SheetClose,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface VilleAddFormProps {
  onSubmit?: (data: CreateVillesDTO) => void;
  onCancel?: () => void;
}

function VilleAddForm({ onSubmit, onCancel }: VilleAddFormProps) {
  const form = useForm<z.infer<typeof CreateVillesSchema>>({
    resolver: zodResolver(CreateVillesSchema),
    mode: "onSubmit",
    defaultValues: {
      name: "",
      countryCode: "CI",
    },
  });

  const handleSubmit = (data: CreateVillesDTO) => {
    onSubmit?.(data);
  };

  const countryCodes = [
    { code: "CI", name: "Côte d'Ivoire" },
    { code: "SN", name: "Sénégal" },
    { code: "BJ", name: "Bénin" },
    { code: "TG", name: "Togo" },
    { code: "GH", name: "Ghana" },
  ];

  return (
    <>
      <SheetHeader>
        <SheetTitle>Créer une nouvelle ville</SheetTitle>
        <SheetDescription>
          Remplissez le formulaire ci-dessous pour ajouter une nouvelle ville.
        </SheetDescription>
      </SheetHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 px-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom de la ville</FormLabel>
                <FormControl>
                  <Input autoFocus placeholder="Ex: Abidjan" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="countryCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pays</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Sélectionner un pays" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Pays</SelectLabel>
                        {countryCodes.map((country) => (
                          <SelectItem key={country.code} value={country.code}>
                            {country.name} ({country.code})
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
          <SheetFooter className="px-0">
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Création..." : "Créer la ville"}
            </Button>
            <SheetClose asChild>
              <Button
                disabled={form.formState.isSubmitting}
                variant="outline"
                onClick={onCancel}
              >
                Annuler
              </Button>
            </SheetClose>
          </SheetFooter>
        </form>
      </Form>
    </>
  );
}

export default VilleAddForm;
