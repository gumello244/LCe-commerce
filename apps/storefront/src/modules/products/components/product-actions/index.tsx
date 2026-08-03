"use client"

import { addToCart } from "@lib/data/cart"
import { useIntersection } from "@lib/hooks/use-in-view"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@modules/common/components/ui"
import OptionSelect from "@modules/products/components/product-actions/option-select"
import SizeGuideModal from "@modules/products/components/size-guide-modal"
import { isEqual } from "lodash"
import { useParams } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import ProductPrice from "../product-price"
import MobileActions from "./mobile-actions"

type ProductActionsProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  disabled?: boolean
  onVariantOrColorChange?: (variant?: HttpTypes.StoreProductVariant, color?: string) => void
}

const optionsAsKeymap = (
  variantOptions: HttpTypes.StoreProductVariant["options"]
) => {
  return variantOptions?.reduce((acc: Record<string, string>, varopt) => {
    if (varopt.option_id) acc[varopt.option_id] = varopt.value
    return acc
  }, {})
}

export default function ProductActions({
  product,
  disabled,
  onVariantOrColorChange,
}: ProductActionsProps) {
  const [options, setOptions] = useState<Record<string, string | undefined>>({})
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const [showPaymentInfo, setShowPaymentInfo] = useState(false)
  const countryCode = useParams().countryCode as string

  // If there is only 1 variant, preselect the options
  useEffect(() => {
    if (product.variants?.length === 1) {
      const variantOptions = optionsAsKeymap(product.variants[0].options)
      setOptions(variantOptions ?? {})
    }
  }, [product.variants])

  const selectedVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) {
      return
    }

    return product.variants.find((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  // Extract selected color string
  const selectedColor = useMemo(() => {
    const colorOption = product.options?.find(
      (o) => o.title?.toLowerCase() === "cor" || o.title?.toLowerCase() === "color"
    )
    if (colorOption?.id) {
      return options[colorOption.id]
    }
    return undefined
  }, [product.options, options])

  // Notify parent of variant or color change for gallery updates
  const prevVariantIdRef = useRef<string | undefined>(undefined)
  const prevColorRef = useRef<string | undefined>(undefined)

  useEffect(() => {
    if (
      prevVariantIdRef.current !== selectedVariant?.id ||
      prevColorRef.current !== selectedColor
    ) {
      prevVariantIdRef.current = selectedVariant?.id
      prevColorRef.current = selectedColor
      onVariantOrColorChange?.(selectedVariant, selectedColor)
    }
  }, [selectedVariant, selectedColor, onVariantOrColorChange])
  // Update option values
  const setOptionValue = (optionId: string, value: string) => {
    setOptions((prev) => ({
      ...prev,
      [optionId]: value,
    }))
  }

  // Check valid variant
  const isValidVariant = useMemo(() => {
    return product.variants?.some((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  // Stock check
  const inStock = useMemo(() => {
    if (selectedVariant && !selectedVariant.manage_inventory) {
      return true
    }
    if (selectedVariant?.allow_backorder) {
      return true
    }
    if (
      selectedVariant?.manage_inventory &&
      (selectedVariant?.inventory_quantity || 0) > 0
    ) {
      return true
    }
    return false
  }, [selectedVariant])

  const actionsRef = useRef<HTMLDivElement>(null)
  const inView = useIntersection(actionsRef, "0px")

  // Add to cart with selected quantity
  const handleAddToCart = async () => {
    if (!selectedVariant?.id) return null

    setIsAdding(true)

    await addToCart({
      variantId: selectedVariant.id,
      quantity: quantity,
      countryCode,
    })

    setIsAdding(false)
  }

  // Price calculations for Pix
  const rawPriceNumber = selectedVariant?.calculated_price?.calculated_amount || 0
  const pixPrice = rawPriceNumber ? (rawPriceNumber * 0.97).toFixed(2).replace(".", ",") : null

  return (
    <div className="flex flex-col gap-y-5 text-gray-900" ref={actionsRef}>
      {/* ── Product Code / REF Badge ───────────────────────────────────── */}
      <div className="flex items-center justify-between text-[11px] text-gray-400 font-mono">
        <span>REF: {product.handle?.substring(0, 10).toUpperCase()}</span>
        <span>{selectedColor ? selectedColor.toUpperCase() : ""}</span>
      </div>

      {/* ── Title & Price Section ──────────────────────────────────────── */}
      <div className="space-y-1">
        <h1 className="text-xl md:text-2xl font-bold uppercase tracking-tight text-gray-900 leading-snug">
          {product.title}
        </h1>

        <div className="pt-1">
          <ProductPrice product={product} variant={selectedVariant} />
        </div>

        {pixPrice && (
          <div className="inline-flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 rounded-md mt-2">
            <span className="font-bold text-emerald-800">R$ {pixPrice}</span> no Pix <span className="font-semibold text-emerald-800">(3% OFF)</span>
          </div>
        )}
      </div>

      {/* ── Free Shipping Badge ────────────────────────────────────────── */}
      <div className="flex items-center gap-2 text-xs bg-gray-50 border border-gray-100 p-2.5 rounded-lg text-gray-700">
        <span className="text-base">🚚</span>
        <span><strong>Frete grátis</strong> nas compras acima de R$ 200,00</span>
      </div>

      {/* ── Options (Cor e Tamanho) ────────────────────────────────────── */}
      {(product.variants?.length ?? 0) > 0 && (
        <div className="flex flex-col gap-y-4 pt-1">
          {(product.options || []).map((option) => {
            const isSize = option.title?.toLowerCase().includes("tamanho") || option.title?.toLowerCase().includes("size")
            return (
              <div key={option.id} className="space-y-2">
                <OptionSelect
                  option={option}
                  current={options[option.id]}
                  updateOption={setOptionValue}
                  title={option.title ?? ""}
                  data-testid="product-options"
                  disabled={!!disabled || isAdding}
                />
                {isSize && (
                  <div className="flex justify-end">
                    <SizeGuideModal />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* ── Sizing Advice Box ─────────────────────────────────────────── */}
      <div className="bg-gray-50 border border-gray-200/80 rounded-xl p-3 text-xs text-gray-600 space-y-1">
        <p className="font-semibold text-gray-900">💡 Dica de Tamanho:</p>
        <p>Modelagem padrão. Peça o seu tamanho de costume para caimento perfeito.</p>
      </div>

      {/* ── Quantity + Add to Cart ─────────────────────────────────────── */}
      <div className="flex items-center gap-3 pt-2">
        {/* Quantity selector */}
        <div className="flex items-center border border-gray-200 rounded-xl bg-white h-11 px-2 shrink-0">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="w-7 h-7 flex items-center justify-center text-gray-600 hover:text-black font-bold text-sm"
          >
            -
          </button>
          <span className="w-8 text-center text-xs font-semibold text-gray-900">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            className="w-7 h-7 flex items-center justify-center text-gray-600 hover:text-black font-bold text-sm"
          >
            +
          </button>
        </div>

        {/* Buy / Add to Cart Button */}
        <Button
          onClick={handleAddToCart}
          disabled={
            !inStock ||
            !selectedVariant ||
            !!disabled ||
            isAdding ||
            !isValidVariant
          }
          variant="primary"
          className="flex-1 h-11 bg-brand-teal hover:bg-brand-teal/90 text-white font-bold uppercase tracking-wider text-xs rounded-xl shadow-md transition-transform active:scale-[0.99]"
          isLoading={isAdding}
          data-testid="add-product-button"
        >
          {!selectedVariant && (product.variants?.length ?? 0) > 1
            ? "Selecione a variação"
            : !inStock || !isValidVariant
            ? "Esgotado"
            : "Comprar"}
        </Button>
      </div>

      {/* ── Accordion: Payment Methods ───────────────────────────────── */}
      <div className="border border-gray-200 rounded-xl overflow-hidden mt-2">
        <button
          type="button"
          onClick={() => setShowPaymentInfo(!showPaymentInfo)}
          className="w-full flex items-center justify-between p-3 text-xs font-bold text-gray-900 bg-gray-50/80 hover:bg-gray-100 transition-colors uppercase"
        >
          <span className="flex items-center gap-2">
            <span>💳</span> Meios de Pagamento
          </span>
          <span>{showPaymentInfo ? "−" : "+"}</span>
        </button>

        {showPaymentInfo && (
          <div className="p-3 text-xs text-gray-600 space-y-2 bg-white border-t border-gray-100 animate-fade-in">
            <div className="flex items-center justify-between">
              <span>Pix (Aprovação imediata):</span>
              <span className="font-bold text-emerald-700">3% de desconto</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Cartão de Crédito:</span>
              <span>Até 6x sem juros</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Boleto Bancário:</span>
              <span>À vista</span>
            </div>
          </div>
        )}
      </div>

      {/* ── Social Share & WhatsApp ──────────────────────────────────── */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs text-gray-500">
        <span>Compartilhar:</span>
        <div className="flex items-center gap-3">
          <a
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Olha esse produto lindo da Louise Castelatto: ${product.title}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-600 flex items-center justify-center transition-colors"
            title="Compartilhar no WhatsApp"
          >
            💬
          </a>
          <span className="text-gray-300">|</span>
          <span className="text-gray-400 font-medium cursor-default">Louise Castelatto</span>
        </div>
      </div>

      {/* Mobile Sticky Bar */}
      <MobileActions
        product={product}
        variant={selectedVariant}
        options={options}
        updateOptions={setOptionValue}
        inStock={inStock}
        handleAddToCart={handleAddToCart}
        isAdding={isAdding}
        show={!inView}
        optionsDisabled={!!disabled || isAdding}
      />
    </div>
  )
}
