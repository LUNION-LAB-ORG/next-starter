export enum UtilisateurRole {
  AGENT = "AGENT",
  ADMIN = "ADMIN",
}

export enum UtilisateurStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  DELETED = "DELETED",
}

export interface IUtilisateursParams {
  status?: UtilisateurStatus;
  role?: UtilisateurRole;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  page?: number;
  limit?: number;
}

export interface IUtilisateur {
  id: string;
  fullname: string;
  password?: string;
  phone: string;
  email: string;
  role: UtilisateurRole;
  photoBucket: string;
  photoKey: string;
  address: string;
  createdAt: string;
  updatedAt: string;
  token: string;
  refreshToken: string;
  deletedAt?: string | null;
}

export interface IUtilisateurAddUpdateResponse
  extends Pick<
    IUtilisateur,
    | "id"
    | "email"
    | "fullname"
    | "role"
    | "createdAt"
    | "updatedAt"
    | "deletedAt"
  > {
  generatedPassword: string;
}

export interface IUtilisateurDeleteResponse {
  success: true;
  message: string;
}
