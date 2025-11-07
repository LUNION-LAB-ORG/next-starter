import { addToast } from '@heroui/toast';
import { useMutation } from '@tanstack/react-query';
import { processAndValidateFormData } from 'ak-zod-form-kit';
import { CheckCircle2, X } from 'lucide-react';
import { CreateCategoryDTO, CreateCategorySchema } from '../schema/categorie.schema';
import { ICategory } from '../types/categorie.type';
import { useInvalidateCategoryQuery } from './index.query';
import { ajouterCategoryAction } from '../actions/categorie.action';

export const useAjouterCategoryMutation = () => {
  const invalidateVillesQuery = useInvalidateCategoryQuery();

  return useMutation<ICategory, Error, CreateCategoryDTO>({
    mutationFn: async (data: CreateCategoryDTO) => {
      // Validation des données
      const validation = processAndValidateFormData(CreateCategorySchema, data, {
        outputFormat: 'formData',
      });
      
      console.log('validation:', validation);

      if (!validation.success) {
        throw new Error(
          validation.errorsInString || 'Erreur lors de la validation des Categories.'
        );
      }


      // Appel de l'action
      const result = await ajouterCategoryAction(validation.data as CreateCategoryDTO);
      console.log("Resultat ajout d'une Categorie:", result);
    if (!result.success || !result.data) {
        throw new Error(result.error || "Erreur lors de l’ajout  d'une Categorie.");
      }

      // Retourner directement le bien créé

      return result.data;
    },

    onSuccess: async (Category) => {
      addToast({
        title: 'categorie ajouté avec succès',
        description: 'La categorie a été ajouté avec succès.',
        promise: invalidateVillesQuery(),
        icon: <CheckCircle2 />,
        color: 'success',
      });
    },

    onError: async (error: any) => {
      console.error('Erreur query', error);
      addToast({
        title: 'Erreur lors de l’ajout de la Categorie',
        description: error.message || 'Une erreur est survenue',
        promise: Promise.reject(error),
        icon: <X />,
        color: 'danger',
      });
    },
  });
};
