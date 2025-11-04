import { NextRequest, NextResponse } from "next/server";
import { LoginDTO } from "@/features/auth/schemas/auth.schema";
import { ILoginResponse } from "@/features/auth/types/auth.type";
import { UtilisateurRole, UtilisateurStatus } from "@/features/utilisateur/types/utilisateur.type";

export async function POST(req: NextRequest) {
    try {
        const body = (await req.json()) as LoginDTO;

        // TODO: Vérification email/mot de passe en DB

        // Exemple fictif
        if (body.email === "admin@agence.ci" && body.password === "password") {

 const response: ILoginResponse = {
  id: "1",
  fullname: "Admin Test",
  phone: "0123456789",
  email: body.email,
  role: UtilisateurRole.ADMIN,
  photoBucket: "user-photos",
  photoKey: "default-avatar.png",
  address: "Abidjan, Côte d’Ivoire",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  deletedAt: null,
  token: "ACCESS_TOKEN_EXAMPLE",
  refreshToken: "REFRESH_TOKEN_EXAMPLE",
};



            return NextResponse.json(response);
        }

        return NextResponse.json({ message: "Invalid credentials" }, { status: 400 });
    } catch (error) {
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}
