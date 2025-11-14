"use server";

import { ActionResponse, PaginatedResponse } from "@/types/api.type";
import { handleServerActionError } from "@/utils/handleServerActionError";
import { categoryAPI } from "../apis/categorie.api";
import { CreateCategoryDTO, UpdatePropertyCategoryDTO } from "../schema/categorie.schema";
import { ICategory, ICategoryDeleteResponse, ICategoryParams } from "../types/categorie.type";

export const obtenirTousCategoryAction = async (params: ICategoryParams): Promise<ActionResponse<ICategory[]>> => {
    try {
        const data = await categoryAPI.obtenirTousCategory(params);
        return {
            success: true,
            data: data,
            message: "Category obtenues avec succès",
        }
    } catch (error) {
        return handleServerActionError(error, "Erreur lors de la récupération des Villes");
    }
}

export const obtenirUnCategoryAction = async (id: string): Promise<ActionResponse<ICategory>> => {
    try {
        const data = await categoryAPI.obtenirCategory(id);
        return {
            success: true,
            data: data,
            message: "Category obtenues avec succès",
        }
    } catch (error) {
        return handleServerActionError(error, "Erreur lors de la récupération de la Category");
    }
}

export const ajouterCategoryAction = async (formdata: CreateCategoryDTO): Promise<ActionResponse<ICategory>> => {
    try {
        const data = await categoryAPI.ajouterCategory(formdata);
        console.log("les  data venant de Categorie Action", data);
        return {
            success: true,
            data: data,
            message: "Categorie ajoute avec succès",
        }
    } catch (error) {
        return handleServerActionError(error, "Erreur lors de l'ajout de la Categorie");
    }
}


export const modifierCategoryAction = async (id: string, formdata: UpdatePropertyCategoryDTO): Promise<ActionResponse<ICategory>> => {
    try {
        const data = await categoryAPI.modifierCategory(id, formdata);
        return {
            success: true,
            data: data,
            message: "Profil modifie avec succès",
        }
    } catch (error) {
        return handleServerActionError(error, "Erreur lors de la modification du profil");
    }
}

export const supprimerCategoryAction = async (id: string): Promise<ActionResponse<ICategoryDeleteResponse>> => {
    try {
        const data = await categoryAPI.supprimerCategory(id);
        return {
            success: true,
            data: data,
            message: "Categorie supprimée avec succès",
        }
    } catch (error) {
        return handleServerActionError(error, "Erreur lors de la suppression de la Categorie");
    }
}
