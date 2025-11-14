import { useMutation } from '@tanstack/react-query';
import { addToast } from '@heroui/toast';
import { CheckCircle2, X } from 'lucide-react';
import { processAndValidateFormData } from 'ak-zod-form-kit';
import { ajouterBiensAction } from '../actions/biens.action';
import { BiensAddDTO, BiensAddSchema } from '../schema/biens.schema';
import { useInvalidateBiensQuery } from './index.query';
import { IBiens } from '../types/biens.type';

export const useAjouterBiensMutation = () => {
  const invalidateBiensQuery = useInvalidateBiensQuery();

  return useMutation<IBiens, Error, BiensAddDTO>({
    mutationFn: async (data: BiensAddDTO) => {
      // Validation des données
      const validation = processAndValidateFormData(BiensAddSchema, data, {
        outputFormat: 'formData',
      });
      
      console.log('validation:', validation);

      if (!validation.success) {
        throw new Error(
          validation.errorsInString || 'Erreur lors de la validation des données.'
        );
      }


      // Appel de l'action
      const result = await ajouterBiensAction(validation.data as BiensAddDTO);
      console.log('Resultat ajout bien:', result);
    if (!result.success || !result.data) {
        throw new Error(result.error || 'Erreur lors de l’ajout du bien ui.');
      }

      return result.data;
    },

    onSuccess: async (bien) => {
      addToast({
        title: 'Bien ajouté avec succès',
        description: 'Le bien a été ajouté avec succès.',
        promise: invalidateBiensQuery(),
        icon: <CheckCircle2 />,
        color: 'success',
      });
    },

    onError: async (error: any) => {
      console.error('Erreur query', error);
      addToast({
        title: 'Erreur lors de l’ajout du bien',
        description: error.message || 'Une erreur est survenue',
        promise: Promise.reject(error),
        icon: <X />,
        color: 'danger',
      });
    },
  });
};
