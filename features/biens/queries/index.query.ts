import { useQueryClient } from '@tanstack/react-query';

// 1- Clé de cache
export const biensKeyQuery = (...params: any[]) => {
    if (params.length === 0) {
        return ['utilisateur'];
    }
    return ['utilisateur', ...params];
};

// 2. Créez un hook personnalisé pour l'invalidation
export const useInvalidateBiensQuery = () => {
    const queryClient = useQueryClient();

    return async (...params: any[]) => {
        await queryClient.invalidateQueries({
            queryKey: biensKeyQuery(...params),
            exact: false
        });

        await queryClient.refetchQueries({
            queryKey: biensKeyQuery(),
            type: 'active'
        });
    };
};