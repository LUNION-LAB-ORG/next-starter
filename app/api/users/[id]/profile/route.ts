import { NextRequest } from "next/server";
import { UtilisateurUpdateDTO } from "@/features/utilisateur/schema/utilisateur.schema";
import { IUtilisateur, UtilisateurRole, UtilisateurStatus } from "@/features/utilisateur/types/utilisateur.type";

export async function GET(_req: NextRequest, ctx: RouteContext<'/api/users/[id]'>) {
    const { id } = await ctx.params;
    // TODO: récupérer l'utilisateur en DB
    const user: IUtilisateur = {
        id,
        email: "user@test.com",
        firstName: "User",
        lastName: "Test",
        phoneNumber: "0123456789",
        role: UtilisateurRole.ADMIN,
        status: UtilisateurStatus.ACTIVE,
        isPasswordChangeRequired: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deletedAt: "",
    };

    return Response.json(user);
}

export async function PATCH(req: NextRequest, ctx: RouteContext<'/api/users/[id]'>) {
    const { id } = await ctx.params;

    try {
        const body = (await req.json()) as UtilisateurUpdateDTO;

        // TODO: update profil de l'utilisateur connecté
        return Response.json({
            ...body,
            id,
            updatedAt: new Date().toISOString(),
        });
    } catch (error) {
        return Response.json({ error: "Something went wrong" }, { status: 500 });
    }
}
