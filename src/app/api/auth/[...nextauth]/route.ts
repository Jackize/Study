import { authOptions } from "@/utils/constant";
import NextAuth from "next-auth/next";
import GoogleProvider  from "next-auth/providers/google";
const handle = NextAuth(authOptions)

export {handle as GET, handle as POST}