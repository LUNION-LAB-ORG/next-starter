import { api } from "@/lib/api";
import { PaginatedResponse } from "@/types/api.type";
import { SearchParams } from "ak-api-http";
import { CreateCategoryDTO, UpdatePropertyCategoryDTO } from "../schema/categorie.schema";
import { ICategory, ICategoryAddUpdateResponse, ICategoryDeleteResponse, ICategoryParams } from "../types/categorie.type";

export interface ICategoryAPI {
    obtenirTousCategory(params: ICategoryParams): Promise<ICategory[]>;
    obtenirCategory(id: string): Promise<ICategory>;
    ajouterCategory(data: CreateCategoryDTO): Promise<ICategoryAddUpdateResponse>;
    modifierCategory(id: string, data: UpdatePropertyCategoryDTO): Promise<ICategoryAddUpdateResponse>;
    supprimerCategory(id: string): Promise<ICategoryDeleteResponse>;
}

export const categoryAPI: ICategoryAPI = {
    obtenirTousCategory(params: ICategoryParams): Promise<ICategory[]> {
        return api.request<ICategory[]>({
            endpoint: `/property-categories`,
            method: "GET",
            searchParams: params as SearchParams,
        });
    },

    obtenirCategory(id: string): Promise<ICategory> {
        return api.request<ICategory>({
            endpoint: `/property-categories/${id}/profile`,
            method: "GET",
        });
    },
   ajouterCategory(data: CreateCategoryDTO): Promise<ICategoryAddUpdateResponse> {
    return api.request<ICategoryAddUpdateResponse>({
        endpoint: `/property-categories`,
        method: "POST",
        data, // objet JS, envoyé en JSON
        // ne pas mettre multipart/form-data
    });
}
,
    modifierCategory(id: string, data: CreateCategoryDTO): Promise<ICategoryAddUpdateResponse> {
        return api.request<ICategoryAddUpdateResponse>({
            endpoint: `/property-categories/${id}/profile`,
            method: "PATCH",
            data,
        });
    },
    supprimerCategory(id: string): Promise<ICategoryDeleteResponse> {
        return api.request<ICategoryDeleteResponse>({
            endpoint: `/properties/${id}`,
            method: "DELETE",
        });
    },
};
