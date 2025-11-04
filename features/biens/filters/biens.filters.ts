
import { parseAsString, parseAsInteger, parseAsStringEnum } from 'nuqs';
import { UtilisateurRole, UtilisateurStatus } from '@/features/utilisateur/types/utilisateur.type';
import { getEnumValues } from '@/utils/getEnumValues';
import { BiensStatus } from '../types/biens.type';

/**
 * @constant biensFiltersClient
 * @description Définit les schémas de parsing pour les paramètres de requête d'URL
 * utilisés pour filtrer et paginer la liste des utilisateurs.
 * Chaque propriété correspond à un paramètre d'URL et spécifie son type
 * et sa valeur par défaut.
 */
export const biensFiltersClient = {
    filter: {
        status: parseAsStringEnum<BiensStatus>(getEnumValues(BiensStatus)).withDefault(BiensStatus.SOLD),
        role: parseAsStringEnum<UtilisateurRole>(getEnumValues(UtilisateurRole)),
        firstName: parseAsString.withDefault(''),
        lastName: parseAsString.withDefault(''),
        email: parseAsString.withDefault(''),
        phoneNumber: parseAsString.withDefault(''),
        page: parseAsInteger.withDefault(1),
        limit: parseAsInteger.withDefault(5),
    },
    option: {
        clearOnDefault: true,
        throttleMs: 500, // 500ms de délai pour les filtres textuels
    }
};