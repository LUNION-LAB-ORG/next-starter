import { api } from "@/lib/api";
import { PaginatedResponse } from "@/types/api.type";
import { SearchParams } from "ak-api-http";
import { BiensAddDTO, BiensUpdateDTO } from "../schema/biens.schema";
import {
  IAmenity,
  IBiens,
  IBiensAddUpdateResponse,
  IBiensDeleteResponse,
  IBiensParams,
} from "../types/biens.type";

export interface IBiensAPI {
  obtenirTousBiens(params: IBiensParams): Promise<PaginatedResponse<IBiens>>;
  obtenirTousAmenities(): Promise<IAmenity[]>;
  obtenirBiens(id: string): Promise<IBiens>;
  ajouterBiens(data: BiensAddDTO): Promise<IBiensAddUpdateResponse>;
  modifierBiens(
    id: string,
    data: BiensUpdateDTO | FormData,
  ): Promise<IBiensAddUpdateResponse>;
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

  obtenirTousAmenities(): Promise<IAmenity[]> {
    return api.request<IAmenity[]>({
      endpoint: `/properties/amenities`,
      method: "GET",
    });
  },

  obtenirBiens(id: string): Promise<IBiens> {
    return api.request<IBiens>({
      // Single property endpoint should match the properties resource used elsewhere (/properties/:id)
      endpoint: `/properties/${id}`,
      method: "GET",
    });
  },
  ajouterBiens(data: BiensAddDTO): Promise<IBiensAddUpdateResponse> {
    return api.request<IBiensAddUpdateResponse>({
      endpoint: `/properties`,
      method: "POST",
      data,
      config: {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    });
  },
  modifierBiens(
    id: string,
    data: BiensUpdateDTO,
  ): Promise<IBiensAddUpdateResponse> {
    return api.request<IBiensAddUpdateResponse>({
      endpoint: `/properties/${id}`,
      method: "PATCH",
      data,
      config: {
        // Make sure data is sent as FormData if it isn't already
        transformRequest: [
          (data) => {
            if (data instanceof FormData) return data;

            const formData = new FormData();
            // Add each field to FormData, handling arrays and files specially
            Object.entries(data).forEach(([key, value]) => {
              if (value instanceof File) {
                formData.append(key, value);
              } else if (Array.isArray(value)) {
                if (value.length > 0 && value[0] instanceof File) {
                  // Handle file arrays (like images)
                  value.forEach((file) => formData.append(key, file));
                } else {
                  // Handle normal arrays
                  formData.append(key, JSON.stringify(value));
                }
              } else if (value !== undefined && value !== null) {
                formData.append(key, String(value));
              }
            });
            return formData;
          },
        ],
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    });
  },
  supprimerBiens(id: string): Promise<IBiensDeleteResponse> {
    return api.request<IBiensDeleteResponse>({
      endpoint: `/properties/${id}`,
      method: "DELETE",
    });
  },
};
