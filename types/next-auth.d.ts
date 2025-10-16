import NextAuth, { type DefaultSession } from "next-auth"

// Rozszerzamy domyślny typ User, dodając pole 'role'
declare module "next-auth" {
    interface User {
        role: string
    }

    // Rozszerzamy sesję, aby zawierała naszego zmodyfikowanego użytkownika
    interface Session {
        user: {
            role: string
        } & DefaultSession["user"]
    }
}
