import { addToast } from '@heroui/toast';
import { useMutation } from '@tanstack/react-query';
import { processAndValidateFormData } from 'ak-zod-form-kit';
import { CheckCircle2, X } from 'lucide-react';
import { ajouterVillesAction } from '../actions/villes.action';
import { CreateVillesDTO, CreateVillesSchema } from '../schema/villes.schema';
import { IVille } from '../types/villes.type';
import { useInvalidateVillesQuery } from './index.query';

export const useAjouterVillesMutation = () => {
  const invalidateVillesQuery = useInvalidateVillesQuery();

  return useMutation<IVille, Error, CreateVillesDTO>({
    mutationFn: async (data: CreateVillesDTO) => {
      // Validation des données
      const validation = processAndValidateFormData(CreateVillesSchema, data, {
        outputFormat: 'formData',
      });
      
      console.log('validation:', validation);

      if (!validation.success) {
        throw new Error(
          validation.errorsInString || 'Erreur lors de la validation des données.'
        );
      }


      // Appel de l'action
      const result = await ajouterVillesAction(validation.data as CreateVillesDTO);
      console.log("Resultat ajout d'une ville:", result);
    if (!result.success || !result.data) {
        throw new Error(result.error || "Erreur lors de l’ajout  d'une ville.");
      }

      // Retourner directement le bien créé

      return result.data;
    },

    onSuccess: async (ville) => {
      addToast({
        title: 'Ville ajouté avec succès',
        description: 'La ville a été ajouté avec succès.',
        promise: invalidateVillesQuery(),
        icon: <CheckCircle2 />,
        color: 'success',
      });
    },

    onError: async (error: any) => {
      console.error('Erreur query', error);
      addToast({
        title: 'Erreur lors de l’ajout de la vile',
        description: error.message || 'Une erreur est survenue',
        promise: Promise.reject(error),
        icon: <X />,
        color: 'danger',
      });
    },
  });
};
