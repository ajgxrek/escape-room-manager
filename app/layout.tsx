import type { Metadata } from "next";
import "./globals.css";
import { Work_Sans } from "next/font/google";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";

const workSans = Work_Sans({
    subsets: ['latin'],
    weight: ['100', '200', '400', '500', '600', '700', '800', '900'],
    variable: '--font-work-sans',
})

export const metadata: Metadata = {
    title: "Escape Room Manager",
    description: "Zarządzanie escape roomem",
};

export default async function RootLayout({
                                             children,
                                         }: Readonly<{
    children: React.ReactNode;
}>) {
    // Pobieramy sesję na serwerze, aby przekazać ją do Providera
    const session = await auth();
    return (
        <html lang="pl">
        <body className={`${workSans.variable} bg-gray-50`}>
        {/* SessionProvider jest niezbędny do użycia `signIn` w komponentach klienckich */}
        <SessionProvider session={session}>
            <Navbar />
            <main className="min-h-screen">
                {children}
            </main>
            <Footer />
        </SessionProvider>
        </body>
        </html>
    );
}
