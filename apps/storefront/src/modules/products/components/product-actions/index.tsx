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

  // Preselect options if only 1 variant exists
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

  const selectedColor = useMemo(() => {
    const colorOption = product.options?.find(
      (o) => o.title?.toLowerCase() === "cor" || o.title?.toLowerCase() === "color"
    )
    if (colorOption?.id) {
      return options[colorOption.id]
    }
    return undefined
  }, [product.options, options])

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

  const setOptionValue = (optionId: string, value: string) => {
    setOptions((prev) => ({
      ...prev,
      [optionId]: value,
    }))
  }

  const isValidVariant = useMemo(() => {
    return product.variants?.some((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

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

  const handleAddToCart = async () => {
    if (!selectedVariant?.id) return null

    setIsAdding(true)

    try {
      await addToCart({
        variantId: selectedVariant.id,
        quantity: quantity,
        countryCode,
      })
    } catch (e) {
      console.error("Erro ao adicionar produto ao carrinho:", e)
    } finally {
      setIsAdding(false)
    }
  }

  const rawPriceNumber = selectedVariant?.calculated_price?.calculated_amount || 0
  const pixPrice = rawPriceNumber ? (rawPriceNumber * 0.97).toFixed(2).replace(".", ",") : null

  const hasSizeOption = product.options?.some(
    (o) => o.title?.toLowerCase().includes("tamanho") || o.title?.toLowerCase().includes("size")
  )

  return (
    <div className="flex flex-col gap-y-5 text-gray-900" ref={actionsRef}>
      {/* ── Title & Price Header (Estilo Código Girls) ───────────────── */}
      <div className="space-y-2 border-b border-gray-200 pb-5">
        <h1 className="text-2xl md:text-3xl font-extrabold uppercase tracking-tight text-gray-900 leading-snug">
          {product.title}
        </h1>

        <div className="pt-1">
          <ProductPrice product={product} variant={selectedVariant} />
        </div>

        {pixPrice && (
          <div className="inline-flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-3 py-1 rounded-full font-medium">
            <span className="font-bold text-emerald-900">R$ {pixPrice}</span> no Pix <span className="font-semibold text-emerald-700">(3% OFF)</span>
          </div>
        )}
      </div>

      {/* ── Free Shipping Badge with SVG Truck Icon ──────────────────── */}
      <div className="flex items-center gap-2.5 text-xs text-gray-800 font-medium py-1">
        <svg
          className="w-5 h-5 text-gray-700 shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.75"
            d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.25v11.25M14.25 7.5H4.875c-.621 0-1.125.504-1.125 1.125v4.125c0 .621.504 1.125 1.125 1.125h9.75"
          />
        </svg>
        <span>Frete grátis a partir de R$ 200,00</span>
      </div>

      {/* ── Options (COR e TAMANHO lado a lado) ──────────────────────── */}
      {(product.variants?.length ?? 0) > 0 && (
        <div className="flex flex-col gap-y-3 pt-1">
          <div className="flex flex-wrap sm:flex-nowrap items-start gap-4">
            {(product.options || []).map((option) => (
              <OptionSelect
                key={option.id}
                option={option}
                current={options[option.id]}
                updateOption={setOptionValue}
                title={option.title ?? ""}
                data-testid="product-options"
                disabled={!!disabled || isAdding}
              />
            ))}
          </div>

          {/* Guia de medidas (Posicionado abaixo dos seletores) */}
          {hasSizeOption && (
            <div className="flex items-center pt-1">
              <SizeGuideModal />
            </div>
          )}
        </div>
      )}

      {/* ── Quantity + Buy Button (Pílula arredondada) ───────────────── */}
      <div className="flex items-center gap-3 pt-3">
        {/* Quantity selector */}
        <div className="flex items-center border border-gray-300 rounded-full bg-white h-12 px-3 shrink-0 shadow-2xs">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="w-7 h-7 flex items-center justify-center text-gray-700 hover:text-black font-bold text-base cursor-pointer"
          >
            -
          </button>
          <span className="w-8 text-center text-sm font-bold text-gray-900">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            className="w-7 h-7 flex items-center justify-center text-gray-700 hover:text-black font-bold text-base cursor-pointer"
          >
            +
          </button>
        </div>

        {/* Buy / COMPRAR Button */}
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
          className="flex-1 h-12 bg-brand-teal hover:bg-brand-teal/90 text-white font-extrabold uppercase tracking-wider text-sm rounded-full shadow-md transition-all active:scale-[0.99]"
          isLoading={isAdding}
          data-testid="add-product-button"
        >
          {!selectedVariant && (product.variants?.length ?? 0) > 1
            ? "SELECIONE A VARIAÇÃO"
            : !inStock || !isValidVariant
            ? "ESGOTADO"
            : "COMPRAR"}
        </Button>
      </div>

      {/* ── Accordion: Payment Methods (Com SVG) ────────────────────── */}
      <div className="border border-gray-200 rounded-2xl overflow-hidden mt-2">
        <button
          type="button"
          onClick={() => setShowPaymentInfo(!showPaymentInfo)}
          className="w-full flex items-center justify-between p-3.5 text-xs font-bold text-gray-900 bg-gray-50/80 hover:bg-gray-100 transition-colors uppercase cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.75"
                d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5z"
              />
            </svg>
            Meios de Pagamento
          </span>
          <span>{showPaymentInfo ? "−" : "+"}</span>
        </button>

        {showPaymentInfo && (
          <div className="p-4 text-xs text-gray-600 space-y-2.5 bg-white border-t border-gray-100 animate-fade-in">
            <div className="flex items-center justify-between">
              <span>Pix (Aprovação imediata):</span>
              <span className="font-bold text-emerald-800">3% de desconto</span>
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

      {/* ── Social Share with SVG WhatsApp Icon ─────────────────────── */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs text-gray-500">
        <span>Compartilhar:</span>
        <div className="flex items-center gap-3">
          <a
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Confira este produto: ${product.title}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-600 flex items-center justify-center transition-colors"
            title="Compartilhar no WhatsApp"
          >
            <svg
              className="w-4 h-4 fill-emerald-600"
              viewBox="0 0 24 24"
            >
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
            </svg>
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

