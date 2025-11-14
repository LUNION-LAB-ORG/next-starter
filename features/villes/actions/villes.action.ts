"use server";

import { ActionResponse, PaginatedResponse } from "@/types/api.type";
import { handleServerActionError } from "@/utils/handleServerActionError";
import { villesAPI } from "../apis/villes.api";
import { CreateVillesDTO, UpdateVillesDTO } from "../schema/villes.schema";
import { IVilles, IVillesDeleteResponse, IVillesParams } from "../types/villes.type";

export const obtenirTousVillesAction = async (params: IVillesParams): Promise<ActionResponse<IVilles[]>> => {
    try {
        const data = await villesAPI.obtenirTousVilles(params);
        return {
            success: true,
            data: data,
            message: "Villes obtenues avec succès",
        }
    } catch (error) {
        return handleServerActionError(error, "Erreur lors de la récupération des Villes");
    }
}

export const obtenirUnVillesAction = async (id: string): Promise<ActionResponse<IVilles>> => {
    try {
        const data = await villesAPI.obtenirVilles(id);
        return {
            success: true,
            data: data,
            message: "Villes obtenues avec succès",
        }
    } catch (error) {
        return handleServerActionError(error, "Erreur lors de la récupération de la ville");
    }
}

export const ajouterVillesAction = async (formdata: CreateVillesDTO): Promise<ActionResponse<IVilles>> => {
    try {
        const data = await villesAPI.ajouterVilles(formdata);
        console.log("les  data venant de Villes Action", data);
        return {
            success: true,
            data: data,
            message: "Villes ajoute avec succès",
        }
    } catch (error) {
        return handleServerActionError(error, "Erreur lors de l'ajout du biens");
    }
}


export const modifierVillesAction = async (id: string, formdata: UpdateVillesDTO): Promise<ActionResponse<IVilles>> => {
    try {
        const data = await villesAPI.modifierVilles(id, formdata);
        return {
            success: true,
            data: data,
            message: "Profil modifie avec succès",
        }
    } catch (error) {
        return handleServerActionError(error, "Erreur lors de la modification du profil");
    }
}

export const supprimerVillesAction = async (id: string): Promise<ActionResponse<IVillesDeleteResponse>> => {
    try {
        const data = await villesAPI.supprimerVilles(id);
        return {
            success: true,
            data: data,
            message: "Utilisateur supprime avec succès",
        }
    } catch (error) {
        return handleServerActionError(error, "Erreur lors de la suppression de l'utilisateur");
    }
}
