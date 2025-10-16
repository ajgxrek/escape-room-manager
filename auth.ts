import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import { Adapter } from "next-auth/adapters" // <-- KROK 1: Dodaj ten import

export const { handlers, auth, signIn, signOut } = NextAuth({
    // ZMIANA TUTAJ: Dodajemy `as Adapter`
    adapter: PrismaAdapter(prisma) as Adapter, // <-- KROK 2: Dodaj `as Adapter`
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    callbacks: {
        async session({ session, user }) {
            if (session.user) {
                session.user.id = user.id;
                session.user.role = user.role;
            }
            return session;
        },
    },
})

