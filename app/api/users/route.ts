import { NextRequest, NextResponse } from "next/server";
import { IUtilisateur, UtilisateurStatus, UtilisateurRole } from "@/features/utilisateur/types/utilisateur.type";
import { PaginatedResponse } from "@/types/api.type";
import { UtilisateurAddDTO } from "@/features/utilisateur/schema/utilisateur.schema";

let users: IUtilisateur[] = [];

export async function GET(req: NextRequest) {
    const searchParams = Object.fromEntries(req.nextUrl.searchParams.entries());

    // TODO: filtrage par params
    const response: PaginatedResponse<IUtilisateur> = {
        data: users,
        meta: {
            total: users.length,
            page: Number(searchParams.page ?? 1),
            limit: Number(searchParams.limit ?? 10),
            totalPages: 1
        }
    };

    return NextResponse.json(response);
}

export async function POST(req: NextRequest) {
    try {
        const body = (await req.json()) as UtilisateurAddDTO;

        const newUser: IUtilisateur = {
            id: String(users.length + 1),
            email: body.email,
            firstName: body.firstName,
            lastName: body.lastName,
            phoneNumber: body.phoneNumber,
            role: UtilisateurRole.AGENT,
            status: UtilisateurStatus.ACTIVE,
            isPasswordChangeRequired: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            deletedAt: "",
        };

        users.push(newUser);

        return NextResponse.json({
            ...newUser,
            generatedPassword: "Random123!",
        });
    } catch (error) {
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
