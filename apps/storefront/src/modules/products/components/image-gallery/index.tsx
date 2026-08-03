"use client"

import { HttpTypes } from "@medusajs/types"
import Image from "next/image"
import { useEffect, useMemo, useState } from "react"

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
  selectedVariant?: HttpTypes.StoreProductVariant
  selectedColor?: string
}

const ImageGallery = ({ images, selectedVariant, selectedColor }: ImageGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState(0)

  // Determine active images
  const displayImages = useMemo(() => {
    return images && images.length > 0 ? images : []
  }, [images])

  // Switch image when selectedVariant or selectedColor changes
  useEffect(() => {
    if (!displayImages.length) return

    if (selectedVariant?.images && selectedVariant.images.length > 0) {
      const firstVariantImageId = selectedVariant.images[0].id
      const targetIndex = displayImages.findIndex((img) => img.id === firstVariantImageId)
      if (targetIndex !== -1) {
        setActiveIndex(targetIndex)
        return
      }
    }

    // Fallback: search image metadata or filename matching color name
    if (selectedColor) {
      const colorLower = selectedColor.toLowerCase()
      const matchedIndex = displayImages.findIndex(
        (img) => img.url?.toLowerCase().includes(colorLower)
      )
      if (matchedIndex !== -1) {
        setActiveIndex(matchedIndex)
      }
    }
  }, [selectedVariant, selectedColor, displayImages])

  if (!displayImages.length) {
    return (
      <div className="w-full aspect-[3/4] bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 text-sm">
        Sem imagens disponíveis
      </div>
    )
  }

  const currentImage = displayImages[activeIndex] || displayImages[0]

  return (
    <div className="flex gap-4 items-start w-full">
      {/* ── Vertical Thumbnails (Left side) ────────────────────────── */}
      {displayImages.length > 1 && (
        <div className="flex flex-col gap-2.5 shrink-0 max-h-[650px] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {displayImages.map((image, index) => {
            const isActive = index === activeIndex
            return (
              <button
                key={image.id || index}
                onClick={() => setActiveIndex(index)}
                type="button"
                className={`relative w-16 md:w-20 aspect-[3/4] rounded-lg overflow-hidden border-2 transition-all duration-200 cursor-pointer bg-gray-50 ${isActive
                    ? "border-brand-teal shadow-sm scale-[1.02]"
                    : "border-gray-200 hover:border-gray-300 opacity-70 hover:opacity-100"
                  }`}
              >
                {image.url && (
                  <Image
                    src={image.url}
                    alt={`Miniatura ${index + 1}`}
                    fill
                    sizes="80px"
                    className="object-contain object-center p-0.5"
                  />
                )}
              </button>
            )
          })}
        </div>
      )}

      {/* ── Main Featured Image View ───────────────────────────────── */}
      <div className="relative flex-1 aspect-[3/4] md:aspect-[4/5] w-full max-h-[700px] bg-gray-100/60 rounded-2xl overflow-hidden border border-gray-100 shadow-xs group flex items-center justify-center">
        {currentImage?.url && (
          <Image
            src={currentImage.url}
            alt="Imagem do produto"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 650px"
            className="object-contain object-center transition-transform duration-500 group-hover:scale-105 p-1"
          />
        )}

        {/* Navigation Arrows */}
        {displayImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => setActiveIndex((prev) => (prev > 0 ? prev - 1 : displayImages.length - 1))}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-gray-800 shadow-md flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
              title="Anterior"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => setActiveIndex((prev) => (prev < displayImages.length - 1 ? prev + 1 : 0))}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-gray-800 shadow-md flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
              title="Próxima"
            >
              ›
            </button>

            {/* Counter Badge */}
            <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-xs text-white text-[11px] px-2.5 py-1 rounded-full font-medium">
              {activeIndex + 1} / {displayImages.length}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default ImageGallery
