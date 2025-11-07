import { useQueryClient } from '@tanstack/react-query';

// 1- Clé de cache
export const villesKeyQuery = (...params: any[]) => {
    if (params.length === 0) {
        return ['villes'];
    }
    return ['villes', ...params];
};

// 2. Créez un hook personnalisé pour l'invalidation
export const useInvalidateVillesQuery = () => {
    const queryClient = useQueryClient();

    return async (...params: any[]) => {
        await queryClient.invalidateQueries({
            queryKey: villesKeyQuery(...params),
            exact: false
        });

        await queryClient.refetchQueries({
            queryKey: villesKeyQuery(),
            type: 'active'
        });
    };
};