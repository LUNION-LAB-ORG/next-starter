import { NextRequest } from "next/server";

export async function PATCH(_req: NextRequest, ctx: RouteContext<'/api/users/[id]'>) {
  const { id } = await ctx.params

  return Response.json({
    success: true,
    message: "Utilisateur activé avec succès.",
    id,
  })
}
