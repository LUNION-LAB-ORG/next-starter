import { UtilisateurStatus } from "../types/utilisateur.type";


export function getUtilisateurStatus(status: UtilisateurStatus) {
    switch (status) {
        case UtilisateurStatus.ACTIVE:
            return "Actif";
        case UtilisateurStatus.INACTIVE:
            return "Verrouillé";
        case UtilisateurStatus.DELETED:
            return "Supprimé";
        default:
            return "Inconnu";
    }
}