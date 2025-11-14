"use server";

import { ActionResponse, PaginatedResponse } from "@/types/api.type";
import { handleServerActionError } from "@/utils/handleServerActionError";
import { biensAPI } from "../apis/biens.api";
import { BiensAddDTO, BiensUpdateDTO } from "../schema/biens.schema";
import {
  IAmenity,
  IBiens,
  IBiensDeleteResponse,
  IBiensParams,
} from "../types/biens.type";

export const obtenirTousBiensAction = async (
  params: IBiensParams,
): Promise<ActionResponse<PaginatedResponse<IBiens>>> => {
  try {
    const data = await biensAPI.obtenirTousBiens(params);
    return {
      success: true,
      data: data,
      message: "Utilisateurs obtenus avec succès",
    };
  } catch (error) {
    return handleServerActionError(
      error,
      "Erreur lors de la récupération des biens",
    );
  }
};

export const obtenirTousAmenitiesAction = async (): Promise<
  ActionResponse<IAmenity[]>
> => {
  try {
    const data = await biensAPI.obtenirTousAmenities();
    return {
      success: true,
      data: data,
      message: "Commodités obtenues avec succès",
    };
  } catch (error) {
    return handleServerActionError(
      error,
      "Erreur lors de la récupération des commodités",
    );
  }
};

export const obtenirUnBiensAction = async (
  id: string,
): Promise<ActionResponse<IBiens>> => {
  try {
    const data = await biensAPI.obtenirBiens(id);
    return {
      success: true,
      data: data,
      message: "Utilisateur obtenu avec succès",
    };
  } catch (error) {
    return handleServerActionError(
      error,
      "Erreur lors de la récupération du bien",
    );
  }
};

export const ajouterBiensAction = async (
  formdata: BiensAddDTO,
): Promise<ActionResponse<IBiens>> => {
  try {
    const data = await biensAPI.ajouterBiens(formdata);
    console.log("les  data venant de biens Action", data);
    return {
      success: true,
      data: data,
      message: "Utilisateur ajoute avec succès",
    };
  } catch (error) {
    return handleServerActionError(error, "Erreur lors de l'ajout du biens");
  }
};

export const modifierBiensAction = async (
  id: string,
  formdata: BiensUpdateDTO | FormData,
): Promise<ActionResponse<IBiens>> => {
  try {
    console.log("Attempting to update property with ID:", id);

    // Verify ID format
    if (!id || typeof id !== "string") {
      throw new Error("ID de propriété invalide");
    }

    const data = await biensAPI.modifierBiens(id, formdata);
    return {
      success: true,
      data: data,
      message: "Profil modifie avec succès",
    };
  } catch (error) {
    console.error("Error updating property:", error);
    if (error instanceof Error && error.message.includes("not found")) {
      return {
        success: false,
        error: "La propriété n'existe pas ou a été supprimée",
      };
    }
    return handleServerActionError(
      error,
      "Erreur lors de la modification du profil",
    );
  }
};

export const supprimerBiensAction = async (
  id: string,
): Promise<ActionResponse<IBiensDeleteResponse>> => {
  try {
    const data = await biensAPI.supprimerBiens(id);
    return {
      success: true,
      data: data,
      message: "Utilisateur supprime avec succès",
    };
  } catch (error) {
    return handleServerActionError(
      error,
      "Erreur lors de la suppression de l'utilisateur",
    );
  }
};
