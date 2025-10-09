export default function RoomInfo() {
    return (
        <div className="bg-primary-100 p-8 rounded-[20px] border-[5px] border-black shadow-200 mb-10">
            <h2 className="text-30-semibold mb-6">Warto wiedzieć</h2>
            <ul className="space-y-3 text-16-medium">
                <li className="flex items-start gap-3">
                    <span className="text-primary text-2xl">✓</span>
                    <span>Gra dostępna w języku polskim i angielskim</span>
                </li>
                <li className="flex items-start gap-3">
                    <span className="text-primary text-2xl">✓</span>
                    <span>Zalecamy przybycie 10 minut przed rozpoczęciem</span>
                </li>
                <li className="flex items-start gap-3">
                    <span className="text-primary text-2xl">✓</span>
                    <span>Możliwość anulowania rezerwacji do 24h przed terminem</span>
                </li>
                <li className="flex items-start gap-3">
                    <span className="text-primary text-2xl">✓</span>
                    <span>Dostępny parking dla gości</span>
                </li>
            </ul>
        </div>
    )
}