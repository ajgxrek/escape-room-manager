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
                    {session && session?.user ? (
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

                            {/* ZMIANA TUTAJ */}
                            <Link href="/dashboard">
                                <span className="text-16-medium">{session?.user?.name}</span>
                            </Link>
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