import { api } from "@/lib/api";
import { PaginatedResponse } from "@/types/api.type";
import { SearchParams } from "ak-api-http";
import { BienAddDTO, BienUpdateDTO } from "../schema/biens.schema";
import {
  IAmenity,
  IBien,
  IBiensAddUpdateResponse,
  IBiensDeleteResponse,
  IBiensParams,
} from "../types/biens.type";

export interface IBiensAPI {
  obtenirTousBiens(params: IBiensParams): Promise<PaginatedResponse<IBien>>;
  obtenirTousAmenities(): Promise<IAmenity[]>;
  obtenirBiens(id: string): Promise<IBien>;
  ajouterBiens(data: BienAddDTO): Promise<IBiensAddUpdateResponse>;
  modifierBiens(
    id: string,
    data: BienUpdateDTO | FormData,
  ): Promise<IBiensAddUpdateResponse>;
  supprimerBiens(id: string): Promise<IBiensDeleteResponse>;
}

export const biensAPI: IBiensAPI = {
  obtenirTousBiens(params: IBiensParams): Promise<PaginatedResponse<IBien>> {
    return api.request<PaginatedResponse<IBien>>({
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

  obtenirBiens(id: string): Promise<IBien> {
    return api.request<IBien>({
      // Single property endpoint should match the properties resource used elsewhere (/properties/:id)
      endpoint: `/properties/${id}`,
      method: "GET",
    });
  },
  ajouterBiens(data: BienAddDTO): Promise<IBiensAddUpdateResponse> {
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
    data: BienUpdateDTO,
  ): Promise<IBiensAddUpdateResponse> {
    return api.request<IBiensAddUpdateResponse>({
      endpoint: `/properties/${id}`,
      method: "PATCH",
      data,
      config: {
        // Make sure data is sent as FormData if it isn't already
        transformRequest: [
          (data) => {
            console.log("Transforming request data for modifierBiens:", data);
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
