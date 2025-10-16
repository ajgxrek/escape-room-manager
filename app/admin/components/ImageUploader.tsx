"use client"

import { useState } from 'react';
// ZMIANA TUTAJ: Poprawiony import typów
import { CldUploadWidget, type CldUploadWidgetProps } from 'next-cloudinary';

type ImageUploaderProps = {
    // Przekazujemy istniejące zdjęcia, jeśli edytujemy pokój
    existingImages?: string[];
}

export default function ImageUploader({ existingImages = [] }: ImageUploaderProps) {
    const [images, setImages] = useState<string[]>(existingImages);

    const onUploadSuccess: CldUploadWidgetProps['onSuccess'] = (result) => {
        // Cloudinary zwraca obiekt z informacjami o zdjęciu, my potrzebujemy `secure_url`
        if (typeof result.info === 'object' && result.info !== null && 'secure_url' in result.info) {
            const newImageUrl = result.info.secure_url as string;
            setImages(prevImages => [...prevImages, newImageUrl]);
        }
    }

    const handleDeleteImage = (imageUrl: string) => {
        setImages(prevImages => prevImages.filter(url => url !== imageUrl));
    }

    return (
        <div>
            <label className="startup-form_label">Zdjęcia pokoju</label>
            <div className="mt-3 p-4 border-[3px] border-dashed border-black rounded-[20px]">
                <div className="grid grid-cols-3 gap-4 mb-4 min-h-[8rem]">
                    {images.map(url => (
                        <div key={url} className="relative">
                            <img src={url} alt="Zdjęcie pokoju" className="w-full h-32 object-cover rounded-lg" />
                            <button
                                type="button"
                                onClick={() => handleDeleteImage(url)}
                                className="absolute top-1 right-1 bg-red-600 text-white rounded-full size-6 flex items-center justify-center font-bold leading-none"
                                aria-label="Usuń zdjęcie"
                            >
                                &times;
                            </button>
                        </div>
                    ))}
                </div>

                <CldUploadWidget
                    uploadPreset="ml_default"
                    onSuccess={onUploadSuccess}
                >
                    {({ open }) => {
                        return (
                            <button
                                type="button"
                                onClick={() => open()}
                                className="w-full bg-gray-100 hover:bg-gray-200 border-[3px] border-black text-black font-semibold py-3 rounded-[12px]"
                            >
                                Dodaj zdjęcie
                            </button>
                        );
                    }}
                </CldUploadWidget>
            </div>

            {/* To ukryte pole prześle listę URL-i zdjęć razem z resztą formularza */}
            <input type="hidden" name="images" value={images.join(',')} />
        </div>
    );
}

