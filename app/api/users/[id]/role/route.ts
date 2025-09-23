import { NextRequest } from "next/server";
import { UtilisateurRoleDTO } from "@/features/utilisateur/schema/utilisateur.schema";

export async function PATCH(req: NextRequest, ctx: RouteContext<'/api/users/[id]'>) {
    const { id } = await ctx.params;
    
    const body = (await req.json()) as UtilisateurRoleDTO;

    return Response.json({
        id,
        role: body.role,
        updatedAt: new Date().toISOString(),
    });
}
