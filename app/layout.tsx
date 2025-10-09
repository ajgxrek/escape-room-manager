import type { Metadata } from "next";
import "./globals.css";
import { Work_Sans } from "next/font/google";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const workSans = Work_Sans({
    subsets: ['latin'],
    weight: ['100', '200', '400', '500', '600', '700', '800', '900'],
    variable: '--font-work-sans',
})

export const metadata: Metadata = {
    title: "Escape Room Manager",
    description: "Zarządzanie escape roomem",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pl">
        <body className={`${workSans.variable} bg-gray-50`}>
        <Navbar />
        {children}
        <Footer />
        </body>
        </html>
    );
}