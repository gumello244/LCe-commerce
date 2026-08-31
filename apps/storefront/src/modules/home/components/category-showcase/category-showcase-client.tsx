"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import { getProductPrice } from "@lib/util/get-product-price"

// Mapeamento de cores em português para códigos hexadecimais
const COLOR_HEX_MAP: Record<string, string> = {
  preto: "#18181b",
  cinza: "#9ca3af",
  branco: "#ffffff",
  "off white": "#f5f5f0",
  verde: "#2e5b4b",
  "marrom rosado": "#b88686",
  vermelho: "#a31d24",
  rosa: "#e88ba9",
  "rosa bebê": "#f2c4ce",
  azul: "#3b5998",
  bege: "#d3b691",
  nude: "#d9be9b",
  laranja: "#e67e22",
  amarelo: "#f1c40f",
  lilás: "#9b59b6",
  vinho: "#6b1724",
  chocolate: "#5c3317",
}

const getColorHex = (colorName: string): string => {
  const normalized = colorName.trim().toLowerCase()
  return COLOR_HEX_MAP[normalized] || "#cbd5e1"
}

export type CategoryShowcaseProps = {
  initialProducts: HttpTypes.StoreProduct[]
  activeCategoryHandle?: string
  countryCode: string
}

type TabConfig = {
  id: string
  label: string
  href: string
  badgeText?: string
}

const TABS: TabConfig[] = [
  { id: "vestidos", label: "Vestidos", href: "/roupas/vestidos", badgeText: "Selling Fast" },
  { id: "mais-vendidos", label: "Mais Vendidos", href: "/roupas/vestidos", badgeText: "Best Seller" },
  { id: "novidades", label: "Novidades", href: "/roupas/vestidos", badgeText: "Novidade" },
  { id: "conjuntos", label: "Conjuntos", href: "/roupas/conjuntos", badgeText: "Destaque" },
  { id: "blusas", label: "Blusas", href: "/roupas/blusas", badgeText: "Tendência" },
  { id: "sale", label: "Sale", href: "/store", badgeText: "Imperdível" },
]

export default function CategoryShowcaseClient({
  initialProducts,
  countryCode: _countryCode,
}: CategoryShowcaseProps) {
  const [activeTab, setActiveTab] = useState<string>("vestidos")
  const [wishlist, setWishlist] = useState<Set<string>>(new Set())
  const [selectedColors, setSelectedColors] = useState<Record<string, string>>({})
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const railRef = useRef<HTMLDivElement>(null)

  // Toggle Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const next = new Set(prev)
      if (next.has(productId)) {
        next.delete(productId)
      } else {
        next.add(productId)
      }
      return next
    })
  }

  // Checar botões de rolagem
  const checkScroll = useCallback(() => {
    const el = railRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 10)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10)
  }, [])

  useEffect(() => {
    const el = railRef.current
    if (!el) return
    checkScroll()
    el.addEventListener("scroll", checkScroll, { passive: true })
    window.addEventListener("resize", checkScroll)
    return () => {
      el.removeEventListener("scroll", checkScroll)
      window.removeEventListener("resize", checkScroll)
    }
  }, [checkScroll])

  const scrollLeftAction = () => {
    if (!railRef.current) return
    const cardWidth = railRef.current.clientWidth / 2
    railRef.current.scrollBy({ left: -cardWidth, behavior: "smooth" })
  }

  const scrollRightAction = () => {
    if (!railRef.current) return
    const cardWidth = railRef.current.clientWidth / 2
    railRef.current.scrollBy({ left: cardWidth, behavior: "smooth" })
  }

  const currentTab = TABS.find((t) => t.id === activeTab) || TABS[0]

  return (
    <section className="w-full bg-white pt-12 pb-16 md:pt-16 md:pb-20 select-none">
      {/* ── 1. CABEÇALHO COM TÍTULO E ABAS DE CATEGORIAS (PILLS) ── */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 mb-8 flex flex-col items-center font-condensed">
        {/* Título Centralizado */}
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-gray-900 uppercase text-center mb-6 font-condensed">
          Compre por Categoria
        </h2>

        {/* Linha com Pills e Botão Ver Todos */}
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 relative">
          {/* Pills de Categorias */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 max-w-full justify-center flex-wrap">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    px-4 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all duration-200 cursor-pointer font-condensed
                    ${
                      isActive
                        ? "bg-black text-white shadow-xs scale-102"
                        : "bg-white text-black border border-black hover:bg-black hover:text-white"
                    }
                  `}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* Botão Ver Todos na Extrema Direita */}
          <div className="hidden md:block flex-shrink-0">
            <LocalizedClientLink
              href={currentTab.href}
              className="px-4 py-1.5 rounded-full text-xs font-bold tracking-wide bg-white text-black border border-black hover:bg-black hover:text-white transition-all flex items-center gap-1 group font-condensed"
            >
              <span>Ver Todos os {currentTab.label}</span>
              <svg
                className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </LocalizedClientLink>
          </div>
        </div>
      </div>

      {/* ── 2. TRILHO DE PRODUTOS COM DIVISÓRIAS VERTICAIS FINAS ── */}
      <div className="relative w-full border-t border-b border-black">
        {/* Seta de navegação esquerda */}
        {canScrollLeft && (
          <button
            onClick={scrollLeftAction}
            aria-label="Rolar para a esquerda"
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/85 hover:bg-black text-white flex items-center justify-center shadow-lg transition-all hover:scale-105"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Seta de navegação direita */}
        {canScrollRight && (
          <button
            onClick={scrollRightAction}
            aria-label="Rolar para a direita"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/85 hover:bg-black text-white flex items-center justify-center shadow-lg transition-all hover:scale-105"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {/* Trilho com scroll horizontal e snap */}
        <div
          ref={railRef}
          className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory divide-x divide-black border-l border-r border-black w-full"
        >
          {initialProducts.map((product, index) => {
            // Extrair preços calculados
            const { cheapestPrice } = getProductPrice({ product })
            const priceFormatted = cheapestPrice?.calculated_price || "R$ 189,90"
            const originalPrice = cheapestPrice?.original_price
            const isSale = cheapestPrice?.price_type === "sale"

            // Imagens
            const primaryImage = product.thumbnail || product.images?.[0]?.url || ""
            const secondaryImage = product.images?.[1]?.url || primaryImage

            // Opções de cor
            const colorOption = product.options?.find(
              (o) => o.title?.toLowerCase() === "cor" || o.title?.toLowerCase() === "color"
            )
            const availableColors = colorOption?.values?.map((v) => v.value) || []
            const currentColor = selectedColors[product.id] || availableColors[0] || ""

            const isWishlisted = wishlist.has(product.id)
            const badgeLabel = index === 0 ? "Selling Fast" : index === 1 ? "Popular" : "Novidade"

            return (
              <div
                key={product.id}
                className="flex-shrink-0 w-[50%] sm:w-[33.333%] md:w-[25%] lg:w-[16.666%] snap-start group flex flex-col bg-white"
              >
                <LocalizedClientLink
                  href={`/products/${product.handle}`}
                  className="flex flex-col h-full"
                >
                  {/* ── IMAGEM VERTICAL COM HOVER PARA A 2ª FOTO ── */}
                  <div className="relative w-full aspect-[3/4] bg-[#f8f8f8] overflow-hidden">
                    {/* Badge flutuante */}
                    <div className="absolute top-2.5 left-2.5 z-10 bg-[#ebe3d5]/95 text-gray-900 text-[10px] font-semibold px-2 py-0.5 rounded-xs tracking-wider uppercase shadow-2xs backdrop-blur-xs">
                      {badgeLabel}
                    </div>

                    {/* Foto Principal */}
                    {primaryImage ? (
                      <Image
                        src={primaryImage}
                        alt={product.title || "Vestido Louise Castelatto"}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 17vw"
                        className={`object-cover object-center transition-opacity duration-300 ${
                          secondaryImage && secondaryImage !== primaryImage
                            ? "group-hover:opacity-0"
                            : ""
                        }`}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs uppercase font-medium">
                        Sem Foto
                      </div>
                    )}

                    {/* Foto Secundária no Hover */}
                    {secondaryImage && secondaryImage !== primaryImage && (
                      <Image
                        src={secondaryImage}
                        alt={`${product.title} - secundária`}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 17vw"
                        className="object-cover object-center absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      />
                    )}
                  </div>

                  {/* ── INFORMAÇÕES DO PRODUTO (NOME, FAVORITO, PREÇO E CORES) ── */}
                  <div className="p-3 flex flex-col justify-between flex-grow">
                    <div>
                      {/* Título & Coração de Favorito */}
                      <div className="flex items-start justify-between gap-1.5 mb-1">
                        <h3 className="text-xs font-semibold text-gray-900 tracking-tight leading-snug line-clamp-1 group-hover:text-brand-teal transition-colors">
                          {product.title}
                        </h3>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            toggleWishlist(product.id)
                          }}
                          aria-label="Adicionar aos favoritos"
                          className="flex-shrink-0 text-gray-400 hover:text-red-500 transition-colors p-0.5 -mt-0.5"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            strokeWidth={1.6}
                            stroke="currentColor"
                            className={`w-4 h-4 transition-transform active:scale-125 ${
                              isWishlisted
                                ? "fill-red-500 text-red-500"
                                : "fill-none text-gray-500 hover:text-red-500"
                            }`}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                            />
                          </svg>
                        </button>
                      </div>

                      {/* Preço */}
                      <div className="flex items-center gap-1.5 mb-2">
                        {isSale && originalPrice && (
                          <span className="text-[11px] text-gray-400 line-through">
                            {originalPrice}
                          </span>
                        )}
                        <span className="text-xs font-bold text-gray-900">
                          {priceFormatted}
                        </span>
                      </div>
                    </div>

                    {/* Bolinhas de Cores (Color Swatches) */}
                    {availableColors.length > 0 && (
                      <div className="flex items-center gap-1.5 pt-1 overflow-hidden">
                        {availableColors.slice(0, 5).map((color) => {
                          const isSelected = currentColor === color
                          const bgHex = getColorHex(color)
                          const isWhite = color.toLowerCase().includes("branco") || bgHex === "#ffffff"

                          return (
                            <button
                              key={color}
                              type="button"
                              title={color}
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                setSelectedColors((prev) => ({
                                  ...prev,
                                  [product.id]: color,
                                }))
                              }}
                              className={`
                                w-3.5 h-3.5 rounded-full transition-all flex items-center justify-center
                                ${
                                  isSelected
                                    ? "ring-1 ring-black ring-offset-1 scale-110"
                                    : "opacity-85 hover:opacity-100 hover:scale-105"
                                }
                                ${isWhite ? "border border-gray-300" : ""}
                              `}
                              style={{ backgroundColor: bgHex }}
                            />
                          )
                        })}

                        {availableColors.length > 5 && (
                          <span className="text-[9px] text-gray-500 font-medium ml-0.5">
                            &gt;
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </LocalizedClientLink>
              </div>
            )
          })}
        </div>
      </div>

      {/* Botão Ver Todos no Mobile (no rodapé da seção) */}
      <div className="md:hidden mt-6 flex justify-center px-4 font-condensed">
        <LocalizedClientLink
          href={currentTab.href}
          className="w-full max-w-xs text-center py-2.5 rounded-full text-xs font-bold tracking-wide bg-black text-white hover:bg-gray-800 transition-all shadow-xs font-condensed"
        >
          Ver Todos os {currentTab.label}
        </LocalizedClientLink>
      </div>
    </section>
  )
}
