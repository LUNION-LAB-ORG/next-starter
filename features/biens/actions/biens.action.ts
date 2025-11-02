"use server";

import { ActionResponse, PaginatedResponse } from "@/types/api.type";
import { handleServerActionError } from "@/utils/handleServerActionError";
import { biensAPI, } from "../apis/biens.api";
import { BiensAddDTO, BiensUpdateDTO } from "../schema/biens.schema";
import { IBiens, IBiensDeleteResponse, IBiensParams, } from "../types/biens.type";

export const obtenirTousBiensAction = async (params: IBiensParams): Promise<ActionResponse<PaginatedResponse<IBiens>>> => {
    try {
        const data = await biensAPI.obtenirTousBiens(params);
        return {
            success: true,
            data: data,
            message: "Utilisateurs obtenus avec succès",
        }
    } catch (error) {
        return handleServerActionError(error, "Erreur lors de la récupération des biens");
    }
}

export const obtenirUnBiensAction = async (id: string): Promise<ActionResponse<IBiens>> => {
    try {
        const data = await biensAPI.obtenirBiens(id);
        return {
            success: true,
            data: data,
            message: "Utilisateur obtenu avec succès",
        }
    } catch (error) {
        return handleServerActionError(error, "Erreur lors de la récupération du bien");
    }
}

export const ajouterBiensAction = async (formdata: BiensAddDTO): Promise<ActionResponse<IBiens>> => {
    try {
        const data = await biensAPI.ajouterBiens(formdata);
        console.log("dds data", data);
        return {
            success: true,
            data: data,
            message: "Utilisateur ajoute avec succès",
        }
    } catch (error) {
        return handleServerActionError(error, "Erreur lors de l'ajout du biens");
    }
}


export const modifierBiensAction = async (id: string, formdata: BiensUpdateDTO): Promise<ActionResponse<IBiens>> => {
    try {
        const data = await biensAPI.modifierBiens(id, formdata);
        return {
            success: true,
            data: data,
            message: "Profil modifie avec succès",
        }
    } catch (error) {
        return handleServerActionError(error, "Erreur lors de la modification du profil");
    }
}

export const supprimerBiensAction = async (id: string): Promise<ActionResponse<IBiensDeleteResponse>> => {
    try {
        const data = await biensAPI.supprimerBiens(id);
        return {
            success: true,
            data: data,
            message: "Utilisateur supprime avec succès",
        }
    } catch (error) {
        return handleServerActionError(error, "Erreur lors de la suppression de l'utilisateur");
    }
}
