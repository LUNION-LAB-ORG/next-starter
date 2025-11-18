import { api } from "@/lib/api";
import { PaginatedResponse } from "@/types/api.type";
import { SearchParams } from "ak-api-http";
import { CreateVillesDTO, UpdateVillesDTO,  } from "../schema/villes.schema";
import { IVillesAddUpdateResponse, IVillesParams } from "../types/villes.type";
import { IVille, IVillesDeleteResponse } from './../types/villes.type';

export interface IVillesAPI {
    obtenirTousVilles(params: IVillesParams): Promise<IVille[]>;
    obtenirVilles(id: string): Promise<IVille>;
    ajouterVilles(data: CreateVillesDTO): Promise<IVillesAddUpdateResponse>;
    modifierVilles(id: string, data: UpdateVillesDTO): Promise<IVillesAddUpdateResponse>;
    supprimerVilles(id: string): Promise<IVillesDeleteResponse>;
}

export const villesAPI: IVillesAPI = {
    obtenirTousVilles(params: IVillesParams): Promise<IVille[]> {
        return api.request<IVille[]>({
            endpoint: `/villes`,
            method: "GET",
            searchParams: params as SearchParams,
        });
    },

    obtenirVilles(id: string): Promise<IVille> {
        return api.request<IVille>({
            endpoint: `/villes/${id}/profile`,
            method: "GET",
        });
    },
   ajouterVilles(data: CreateVillesDTO): Promise<IVillesAddUpdateResponse> {
    return api.request<IVillesAddUpdateResponse>({
        endpoint: `/villes`,
        method: "POST",
        data, // objet JS, envoyé en JSON
        // ne pas mettre multipart/form-data
    });
}
,
    modifierVilles(id: string, data: CreateVillesDTO): Promise<IVillesAddUpdateResponse> {
        return api.request<IVillesAddUpdateResponse>({
            endpoint: `/villes/${id}/profile`,
            method: "PATCH",
            data,
        });
    },
    supprimerVilles(id: string): Promise<IVillesDeleteResponse> {
        return api.request<IVillesDeleteResponse>({
            endpoint: `/properties/${id}`,
            method: "DELETE",
        });
    },
};
