import Link from "next/link"
import { auth, signIn, signOut } from "@/auth"

export default async function Navbar() {
    const session = await auth()

    return (
        <header className="px-5 py-3 bg-white shadow-200 font-work-sans border-b-[5px] border-black">
            <nav className="flex justify-between items-center">
                <Link href="/">
                    <h1 className="text-24-black">ESCAPE ROOM</h1>
                </Link>

                <div className="flex items-center gap-5">
                    {session && session.user ? (
                        <>
                            <form
                                action={async () => {
                                    "use server"
                                    await signOut()
                                }}
                            >
                                <button type="submit" className="login">
                                    Wyloguj
                                </button>
                            </form>

                            {/* ZMIANA TUTAJ: Warunkowy link w zależności od roli */}
                            {session.user.role === 'ADMIN' ? (
                                // Jeśli użytkownik jest adminem, link prowadzi do /admin
                                <Link href="/admin">
                                    <span className="text-16-medium font-bold text-primary hover:underline">
                                        {session.user.name} (Panel Admina)
                                    </span>
                                </Link>
                            ) : (
                                // W przeciwnym razie, link prowadzi do /dashboard
                                <Link href="/dashboard">
                                    <span className="text-16-medium hover:underline">
                                        {session.user.name}
                                    </span>
                                </Link>
                            )}
                        </>
                    ) : (
                        <form
                            action={async () => {
                                "use server"
                                await signIn("google")
                            }}
                        >
                            <button type="submit" className="login">
                                Zaloguj się
                            </button>
                        </form>
                    )}
                </div>
            </nav>
        </header>
    )
}
