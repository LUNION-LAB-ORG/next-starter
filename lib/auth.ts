import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { authAPI } from "@/features/auth/apis/auth.api";
import { JWT } from "next-auth/jwt";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 jours (refresh token)
  },
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  debug: process.env.NODE_ENV === "development",
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        try {
          const response = await authAPI.login({
            email: credentials.email.toString(),
            password: credentials.password.toString(),
          });
          console.log("Réponse de l'API d'authentification :", response);
          return {
            id: response.id,
            email: response.email,
            name: response.fullname,
            role: response.role,
            photoBucket: response.photoBucket,
            photoKey: response.photoKey,
            token: response.token,
            refreshToken: response.refreshToken,
          };
        } catch (error) {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    signIn: async ({ user }) => {
      if (user) {
        return true;
      }
      return false;
    },
    async jwt({ token, user, account }) {
      if (account && user) {
        return {
          ...token,
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          photoBucket:user.photoBucket,
          photoKey:user.photoKey,
          token: user.token,
          refreshToken: user.refreshToken,
          accessTokenExpires: Date.now() + 1000 * 60 * 60 * 24 * 30, // 30 jour
          refreshTokenExpires: Date.now() + 1000 * 60 * 60 * 24 * 365, // 1 an
        } as JWT;
      }
      if (token.accessTokenExpires && Date.now() < token.accessTokenExpires) {
        return token;
      }

      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      if (token.id) {
        session.user = {
          id: token.id,
          name: token.name,
          email: token.email,
          role: token.role,
          photokey:token.photoKey,
          photobucket:token.photoBucket,
          token: token.token,
          refreshToken: token.refreshToken,
          
        };
      }
      if (token.error) {
        session.error = token.error;
      }
      return session;
    },
  },
});

async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    if (token.refreshTokenExpires && Date.now() >= token.refreshTokenExpires) {
      throw new Error("Refresh token expiré");
    }
    console.log("Refresh token :", token.refreshToken);
    const response = await authAPI.refreshToken(token.refreshToken as string);
    console.log("Rafraîchissement du jeton d'accès réussi :", response);
    return {
      ...token,
      token: response.token,
      accessTokenExpires: Date.now() + 1000 * 60 * 60 * 24 * 30, // 30 jours
    };
  } catch (error) {
    console.error("Erreur lors du rafraîchissement du jeton d'accès :", error);
    return { ...token, error: "RefreshAccessTokenError" };
  }
}
