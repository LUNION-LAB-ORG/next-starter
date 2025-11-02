import { IUtilisateur, UtilisateurRole } from "@/features/utilisateur/types/utilisateur.type";

export interface ILoginResponse {
  id :string;
  fullname: string;
  phone: string;
  email: string;
  role:UtilisateurRole;
 photoBucket:string;
photoKey:string;
 address: string;
 createdAt:string;
 updatedAt :string;
  token: string;
  refreshToken: string;
  deletedAt?: string|null;
}

export interface IRefreshTokenResponse {
  token: string;
}
