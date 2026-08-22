"use client"

import React, { useState } from "react"
import { HttpTypes } from "@medusajs/types"
import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import ProductTabs from "@modules/products/components/product-tabs"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type ProductMainSectionProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  images: HttpTypes.StoreProductImage[]
}

export default function ProductMainSection({
  product,
  region,
  images,
}: ProductMainSectionProps) {
  const [selectedVariant, setSelectedVariant] = useState<
    HttpTypes.StoreProductVariant | undefined
  >()
  const [selectedColor, setSelectedColor] = useState<string | undefined>()

  const handleVariantOrColorChange = (
    variant?: HttpTypes.StoreProductVariant,
    color?: string
  ) => {
    setSelectedVariant(variant)
    setSelectedColor(color)
  }

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 py-6 md:py-10">
      {/* ── Breadcrumbs ────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 text-xs text-gray-400 mb-6">
        <LocalizedClientLink href="/" className="hover:text-gray-600">
          Início
        </LocalizedClientLink>
        <span>/</span>
        <LocalizedClientLink href="/roupas" className="hover:text-gray-600">
          Roupas
        </LocalizedClientLink>
        {product.collection && (
          <>
            <span>/</span>
            <LocalizedClientLink
              href={`/collections/${product.collection.handle}`}
              className="hover:text-gray-600"
            >
              {product.collection.title}
            </LocalizedClientLink>
          </>
        )}
        <span>/</span>
        <span className="text-gray-800 font-medium truncate max-w-[200px]">
          {product.title}
        </span>
      </div>

      {/* ── Main 50/50 Fluid Product Layout (Estilo AMARO / Zara) ────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-start w-full">
        {/* Left Column: Image Gallery (50% da Tela) */}
        <div className="w-full">
          <ImageGallery
            images={images}
            selectedVariant={selectedVariant}
            selectedColor={selectedColor}
          />
        </div>

        {/* Right Column: Product Actions & Details Sticky Panel (50% da Tela) */}
        <div className="w-full lg:sticky lg:top-28 space-y-6">
          <ProductActions
            product={product}
            region={region}
            onVariantOrColorChange={handleVariantOrColorChange}
          />

          {/* Product Tabs (Material, Envio, Devoluções) */}
          <div className="pt-4 border-t border-gray-100">
            <ProductTabs product={product} />
          </div>
        </div>
      </div>
    </div>
  )
}
