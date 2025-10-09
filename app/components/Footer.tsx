import Link from "next/link"

export default function Footer() {
    return (
        <footer className="bg-black text-white py-10 mt-20">
            <div className="section_container">
                <div className="grid md:grid-cols-3 gap-10">
                    {/* O nas */}
                    <div>
                        <h3 className="text-20-medium mb-4">ESCAPE ROOM</h3>
                        <p className="text-14-normal">
                            Najlepsze escape roomy w mieście. Niezapomniane przygody czekają na Ciebie!
                        </p>
                    </div>

                    {/* Kontakt */}
                    <div>
                        <h3 className="text-20-medium mb-4">Kontakt</h3>
                        <ul className="space-y-2 text-14-normal">
                            <li>📍 ul. Przykładowa 123, Warszawa</li>
                            <li>📞 +48 123 456 789</li>
                            <li>✉️ kontakt@escaperoom.pl</li>
                        </ul>
                    </div>

                    {/* Linki */}
                    <div>
                        <h3 className="text-20-medium mb-4">Przydatne linki</h3>
                        <ul className="space-y-2 text-14-normal">
                            <li>
                                <Link href="/regulamin" className="hover:text-primary transition-colors">
                                    Regulamin
                                </Link>
                            </li>
                            <li>
                                <Link href="/polityka-prywatnosci" className="hover:text-primary transition-colors">
                                    Polityka prywatności
                                </Link>
                            </li>
                            <li>
                                <Link href="/kontakt" className="hover:text-primary transition-colors">
                                    Skontaktuj się z nami
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/20 mt-10 pt-6 text-center text-14-normal">
                    <p>&copy; 2025 Escape Room Manager. Wszelkie prawa zastrzeżone.</p>
                </div>
            </div>
        </footer>
    )
}