import { api } from "@/lib/api";
import { PaginatedResponse } from "@/types/api.type";
import { SearchParams } from "ak-api-http";
import { BiensAddDTO, BiensUpdateDTO } from "../schema/biens.schema";
import { IBiens, IBiensAddUpdateResponse, IBiensDeleteResponse, IBiensParams, } from "../types/biens.type";

export interface IBiensAPI {
    obtenirTousBiens(params: IBiensParams): Promise<PaginatedResponse<IBiens>>;
    obtenirBiens(id: string): Promise<IBiens>;
    ajouterBiens(data: BiensAddDTO): Promise<IBiensAddUpdateResponse>;
    modifierBiens(id: string, data: BiensUpdateDTO): Promise<IBiensAddUpdateResponse>;
    supprimerBiens(id: string): Promise<IBiensDeleteResponse>;
}

export const biensAPI: IBiensAPI = {
    obtenirTousBiens(params: IBiensParams): Promise<PaginatedResponse<IBiens>> {
        return api.request<PaginatedResponse<IBiens>>({
            endpoint: `/properties`,
            method: "GET",
            searchParams: params as SearchParams,
        });
    },

    obtenirBiens(id: string): Promise<IBiens> {
        return api.request<IBiens>({
            endpoint: `/biens/${id}/profile`,
            method: "GET",
        });
    },
    ajouterBiens(data:BiensAddDTO): Promise<IBiensAddUpdateResponse> {
        return api.request<IBiensAddUpdateResponse>({
            endpoint: `/properties`,
            method: "POST",
            data,
            config: {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            },
        });
    },
    modifierBiens(id: string, data: BiensUpdateDTO): Promise<IBiensAddUpdateResponse> {
        return api.request<IBiensAddUpdateResponse>({
            endpoint: `/biens/${id}/profile`,
            method: "PATCH",
            data,
        });
    },
    supprimerBiens(id: string): Promise<IBiensDeleteResponse> {
        return api.request<IBiensDeleteResponse>({
            endpoint: `/properties/${id}`,
            method: "DELETE",
        });
    },
};
