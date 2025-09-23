import { UtilisateurRole } from "../types/utilisateur.type";


export function getUtilisateurRole(role: UtilisateurRole) {
    switch (role) {
        case UtilisateurRole.AGENT:
            return "Agent";
        case UtilisateurRole.ADMIN:
            return "Administrateur";
    }
}