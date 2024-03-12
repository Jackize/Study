import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions, User, getServerSession, Session } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./prisma";

declare module "next-auth" {
    interface Session {
        user: User & {
            isAdmin: Boolean;
        }
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        isAdmin: Boolean;
    }
}

export const urlFetchApi = "http://localhost:3000/api"
export const getAuthSession = () => getServerSession(authOptions)

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: "jwt",
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        })
    ],
    callbacks: {
        async session({ token, session }) {
            if (token) {
                session.user.isAdmin = token.isAdmin
            }
            return session
        },
        async jwt({ token }) {
            const userInDb = await prisma.user.findUnique({
                where: {
                    email: token.email!
                }
            })
            if (userInDb) {
                token.isAdmin = userInDb.isAdmin
            }
            return token
        }
    }
}
