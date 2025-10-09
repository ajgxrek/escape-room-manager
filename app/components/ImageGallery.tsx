"use client"

import { useState } from "react"
import Image from "next/image"

type ImageGalleryProps = {
    images: string[]
    roomName: string
}

export default function ImageGallery({ images, roomName }: ImageGalleryProps) {
    const [currentIndex, setCurrentIndex] = useState(0)

    if (!images || images.length === 0) {
        return (
            <div className="relative h-[400px] w-full bg-gray-300 flex items-center justify-center">
                <p className="text-black-300">Brak zdjęć</p>
            </div>
        )
    }

    const goToPrevious = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        )
    }

    const goToNext = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === images.length - 1 ? 0 : prevIndex + 1
        )
    }

    return (
        <div className="relative h-[500px] w-full group">
            <Image
                src={images[currentIndex]}
                alt={`${roomName} - zdjęcie ${currentIndex + 1}`}
                fill
                className="object-cover"
                priority
            />

            {/* Overlay z gradientem */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

            {/* Strzałki nawigacji */}
            {images.length > 1 && (
                <>
                    <button
                        onClick={goToPrevious}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Poprzednie zdjęcie"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <button
                        onClick={goToNext}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Następne zdjęcie"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </>
            )}

            {/* Wskaźniki (kropki) */}
            {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`w-3 h-3 rounded-full transition-all ${
                                index === currentIndex
                                    ? 'bg-white w-8'
                                    : 'bg-white/50 hover:bg-white/75'
                            }`}
                            aria-label={`Przejdź do zdjęcia ${index + 1}`}
                        />
                    ))}
                </div>
            )}

            {/* Licznik zdjęć */}
            <div className="absolute top-4 right-4 bg-black/70 text-white px-4 py-2 rounded-full text-sm">
                {currentIndex + 1} / {images.length}
            </div>
        </div>
    )
}