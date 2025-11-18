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
  CreateCategoryDTO,
  CreateCategorySchema,
} from "@/features/categorie/schema/categorie.schema";
import {
  SheetClose,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface CategorieAddFormProps {
  onSubmit?: (data: CreateCategoryDTO) => void;
  onCancel?: () => void;
}

function CategorieAddForm({ onSubmit, onCancel }: CategorieAddFormProps) {
  const form = useForm<z.infer<typeof CreateCategorySchema>>({
    resolver: zodResolver(CreateCategorySchema),
    mode: "onSubmit",
    defaultValues: {
      label: "",
      parentId: undefined,
    },
  });

  const handleSubmit = (data: CreateCategoryDTO) => {
    onSubmit?.(data);
  };

  return (
    <>
      <SheetHeader>
        <SheetTitle>Créer une nouvelle catégorie</SheetTitle>
        <SheetDescription>
          Remplissez le formulaire ci-dessous pour ajouter une nouvelle catégorie de bien.
        </SheetDescription>
      </SheetHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 px-4">
          <FormField
            control={form.control}
            name="label"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom de la catégorie</FormLabel>
                <FormControl>
                  <Input autoFocus placeholder="Ex: Appartements" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <SheetFooter className="px-0">
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Création..." : "Créer la catégorie"}
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

export default CategorieAddForm;

