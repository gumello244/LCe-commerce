"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

// Map de cores padrão com hexadecimais correspondentes
const COLOR_HEX_MAP: Record<string, string> = {
  preto: "#1a1a1a",
  black: "#1a1a1a",
  branco: "#ffffff",
  white: "#ffffff",
  "off white": "#faf9f6",
  offwhite: "#faf9f6",
  rosa: "#E8A0B4",
  pink: "#E8A0B4",
  bege: "#D3B691",
  beige: "#D3B691",
  areia: "#D3B691",
  azul: "#7FA9C4",
  blue: "#7FA9C4",
  "azul claro": "#A0C4DF",
  "azul escuro": "#2C4C6E",
  verde: "#7EB8A4",
  green: "#7EB8A4",
  marrom: "#8B5E3C",
  brown: "#8B5E3C",
  vermelho: "#C75B5B",
  red: "#C75B5B",
  "jeans claro": "#A2C4E5",
  "jeans médio": "#5B8FB9",
  "jeans escuro": "#2B4C7E",
  jeans: "#5B8FB9",
}

const DEFAULT_FALLBACK_COLORS = [
  { label: "Preto", value: "preto", hex: "#1a1a1a" },
  { label: "Branco", value: "branco", hex: "#ffffff" },
  { label: "Rosa", value: "rosa", hex: "#E8A0B4" },
  { label: "Bege", value: "bege", hex: "#D3B691" },
  { label: "Azul", value: "azul", hex: "#7FA9C4" },
  { label: "Verde", value: "verde", hex: "#7EB8A4" },
]

const DEFAULT_FALLBACK_SIZES = ["PP", "P", "M", "G", "GG", "36", "38", "40", "42"]

const sortOptions: { value: SortOptions; label: string }[] = [
  { value: "created_at", label: "Mais recentes" },
  { value: "price_asc", label: "Preço: Menor → Maior" },
  { value: "price_desc", label: "Preço: Maior → Menor" },
]

type ColorOption = {
  label: string
  value: string
  hex: string
}

type SizeOption = {
  label: string
  value: string
}

// ─── Componente de Slider de Faixa de Preço Dupla ──────────────────────────────
function PriceRangeSlider({
  minVal,
  maxVal,
  minFloor,
  maxCeil,
  onChange,
}: {
  minVal: number
  maxVal: number
  minFloor: number
  maxCeil: number
  onChange: (min: number, max: number) => void
}) {
  const [localMin, setLocalMin] = useState(minVal)
  const [localMax, setLocalMax] = useState(maxVal)

  useEffect(() => {
    setLocalMin(minVal)
    setLocalMax(maxVal)
  }, [minVal, maxVal])

  const safeFloor = minFloor
  const safeCeil = Math.max(maxCeil, minFloor + 10)

  const minPercent = Math.max(
    0,
    Math.min(100, ((localMin - safeFloor) / (safeCeil - safeFloor)) * 100)
  )
  const maxPercent = Math.max(
    0,
    Math.min(100, ((localMax - safeFloor) / (safeCeil - safeFloor)) * 100)
  )

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.min(Number(e.target.value), localMax - 5)
    setLocalMin(val)
  }

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.max(Number(e.target.value), localMin + 5)
    setLocalMax(val)
  }

  const handleRelease = () => {
    onChange(localMin, localMax)
  }

  return (
    <div className="w-full pt-7 pb-2 px-1">
      <div className="relative w-full h-1.5 bg-gray-200 rounded-full flex items-center">
        {/* Barra preenchida na cor da marca */}
        <div
          className="absolute h-1.5 bg-brand-teal rounded-full"
          style={{
            left: `${minPercent}%`,
            width: `${Math.max(0, maxPercent - minPercent)}%`,
          }}
        />

        {/* Badge Min Value */}
        <div
          className="absolute -top-7 transform -translate-x-1/2 bg-brand-teal text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-xs whitespace-nowrap pointer-events-none transition-all duration-75"
          style={{ left: `${minPercent}%` }}
        >
          R$ {localMin.toFixed(0)}
        </div>

        {/* Badge Max Value */}
        <div
          className="absolute -top-7 transform -translate-x-1/2 bg-brand-teal text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-xs whitespace-nowrap pointer-events-none transition-all duration-75"
          style={{ left: `${maxPercent}%` }}
        >
          R$ {localMax.toFixed(0)}
        </div>

        {/* Input Min Range */}
        <input
          type="range"
          min={safeFloor}
          max={safeCeil}
          value={localMin}
          onChange={handleMinChange}
          onMouseUp={handleRelease}
          onTouchEnd={handleRelease}
          className="absolute w-full appearance-none bg-transparent pointer-events-none z-30 focus:outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-brand-teal [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-brand-teal [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto"
        />

        {/* Input Max Range */}
        <input
          type="range"
          min={safeFloor}
          max={safeCeil}
          value={localMax}
          onChange={handleMaxChange}
          onMouseUp={handleRelease}
          onTouchEnd={handleRelease}
          className="absolute w-full appearance-none bg-transparent pointer-events-none z-40 focus:outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-brand-teal [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-brand-teal [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto"
        />
      </div>

      {/* Valores de piso e teto abaixo */}
      <div className="flex justify-between items-center mt-4 text-[11px] font-semibold text-gray-400">
        <span>R$ {safeFloor.toFixed(0)}</span>
        <span>R$ {safeCeil.toFixed(0)}</span>
      </div>
    </div>
  )
}

// ─── Ícones ──────────────────────────────────────────────────────────────────
const SlidersIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className="w-4 h-4 shrink-0"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 13.5V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 0V20.25m6-9V3.75m0 7.5a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 0V20.25m6-12V3.75m0 4.5a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 0V20.25"
    />
  </svg>
)

const XIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className="w-6 h-6"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
  </svg>
)

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-bold tracking-[0.12em] uppercase text-gray-500 mb-3">
      {children}
    </p>
  )
}

function ShowMoreBtn({
  expanded,
  onClick,
}: {
  expanded: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="mt-3 px-5 py-1.5 rounded-full border border-gray-300 text-xs text-gray-700 font-bold uppercase tracking-wider hover:border-brand-teal hover:text-brand-teal transition-colors"
    >
      {expanded ? "Ver menos" : "Ver todos"}
    </button>
  )
}

export default function CategorySidebar({
  categoryName,
  subcategorySlug,
  allowedJeansColorsOnly,
  categoryId,
  countryCode,
  sortBy = "created_at",
}: {
  categoryName: string
  subcategorySlug?: string
  allowedJeansColorsOnly?: boolean
  categoryId?: string
  countryCode?: string
  sortBy?: SortOptions
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Dynamic filter state
  const [availableColors, setAvailableColors] = useState<ColorOption[]>(DEFAULT_FALLBACK_COLORS)
  const [availableSizes, setAvailableSizes] = useState<SizeOption[]>(
    DEFAULT_FALLBACK_SIZES.map((s) => ({ label: s, value: s }))
  )
  const [minCalculatedPrice, setMinCalculatedPrice] = useState<number>(0)
  const [maxCalculatedPrice, setMaxCalculatedPrice] = useState<number>(500)

  // Mobile drawer state
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)

  // Active filters state
  const initialColors = searchParams.getAll("color")
  const initialSizes = searchParams.getAll("size")
  const initialMin = searchParams.get("priceMin") || ""
  const initialMax = searchParams.get("priceMax") || ""

  const [selectedColors, setSelectedColors] = useState<string[]>(initialColors)
  const [selectedSizes, setSelectedSizes] = useState<string[]>(initialSizes)
  const [priceMin, setPriceMin] = useState(initialMin)
  const [priceMax, setPriceMax] = useState(initialMax)

  // Expand state
  const [colorsExpanded, setColorsExpanded] = useState(false)
  const [sizesExpanded, setSizesExpanded] = useState(false)

  // Sync state with URL params
  useEffect(() => {
    setSelectedColors(searchParams.getAll("color"))
    setSelectedSizes(searchParams.getAll("size"))
    setPriceMin(searchParams.get("priceMin") || "")
    setPriceMax(searchParams.get("priceMax") || "")
  }, [searchParams])

  // ── Extração dinâmica de opções a partir dos produtos do Medusa ────────────
  useEffect(() => {
    let isMounted = true

    async function fetchDynamicFilters() {
      if (!categoryId) return

      try {
        const query: Record<string, unknown> = {
          category_id: [categoryId],
          fields: "*options,*options.values,*variants,*variants.calculated_price",
          limit: 100,
        }

        const res = await sdk.client.fetch<{ products: HttpTypes.StoreProduct[] }>(
          "/store/products",
          { query, cache: "no-store" }
        )

        if (!isMounted) return

        const products = res.products || []
        const colorMap = new Map<string, ColorOption>()
        const sizeMap = new Map<string, SizeOption>()
        let lowestPrice: number | null = null
        let highestPrice: number | null = null

        products.forEach((prod) => {
          prod.variants?.forEach((v) => {
            if (v.calculated_price?.calculated_amount) {
              const amount = v.calculated_price.calculated_amount
              if (lowestPrice === null || amount < lowestPrice) {
                lowestPrice = amount
              }
              if (highestPrice === null || amount > highestPrice) {
                highestPrice = amount
              }
            }
          })

          prod.options?.forEach((opt) => {
            const titleLower = opt.title?.toLowerCase() || ""
            if (titleLower.includes("cor") || titleLower.includes("color")) {
              opt.values?.forEach((val) => {
                const valStr = val.value?.trim() || ""
                const valLower = valStr.toLowerCase()

                if (allowedJeansColorsOnly && !valLower.includes("jeans")) {
                  return
                }

                if (!colorMap.has(valLower)) {
                  colorMap.set(valLower, {
                    label: valStr,
                    value: valLower,
                    hex: COLOR_HEX_MAP[valLower] || "#cccccc",
                  })
                }
              })
            } else if (titleLower.includes("tamanho") || titleLower.includes("size")) {
              opt.values?.forEach((val) => {
                const valStr = val.value?.trim() || ""
                const valLower = valStr.toLowerCase()
                if (!sizeMap.has(valLower)) {
                  sizeMap.set(valLower, {
                    label: valStr,
                    value: valLower,
                  })
                }
              })
            }
          })
        })

        if (colorMap.size > 0) {
          setAvailableColors(Array.from(colorMap.values()))
        } else if (allowedJeansColorsOnly) {
          setAvailableColors([
            { label: "Jeans Claro", value: "jeans claro", hex: "#A2C4E5" },
            { label: "Jeans Médio", value: "jeans médio", hex: "#5B8FB9" },
            { label: "Jeans Escuro", value: "jeans escuro", hex: "#2B4C7E" },
          ])
        }

        if (sizeMap.size > 0) {
          setAvailableSizes(Array.from(sizeMap.values()))
        }

        if (lowestPrice !== null) {
          setMinCalculatedPrice(lowestPrice)
        }

        if (highestPrice !== null) {
          setMaxCalculatedPrice(Math.max(highestPrice, (lowestPrice || 0) + 100))
        }
      } catch (err) {
        console.error("Erro ao buscar filtros dinâmicos:", err)
      }
    }

    fetchDynamicFilters()

    return () => {
      isMounted = false
    }
  }, [categoryId, allowedJeansColorsOnly])

  const updateQuery = useCallback(
    (updater: (params: URLSearchParams) => void) => {
      const params = new URLSearchParams(searchParams.toString())
      updater(params)
      params.delete("page")
      const qs = params.toString()
      router.push(qs ? `${pathname}?${qs}` : pathname)
    },
    [pathname, router, searchParams]
  )

  const toggleColor = (value: string) => {
    const next = selectedColors.includes(value)
      ? selectedColors.filter((c) => c !== value)
      : [...selectedColors, value]
    setSelectedColors(next)
    updateQuery((params) => {
      params.delete("color")
      next.forEach((c) => params.append("color", c))
    })
  }

  const toggleSize = (value: string) => {
    const next = selectedSizes.includes(value)
      ? selectedSizes.filter((s) => s !== value)
      : [...selectedSizes, value]
    setSelectedSizes(next)
    updateQuery((params) => {
      params.delete("size")
      next.forEach((s) => params.append("size", s))
    })
  }

  const handleSortChange = (newSort: string) => {
    updateQuery((params) => {
      params.set("sortBy", newSort)
    })
  }

  const handleSliderChange = (min: number, max: number) => {
    setPriceMin(String(min))
    setPriceMax(String(max))
    updateQuery((params) => {
      params.set("priceMin", String(min))
      params.set("priceMax", String(max))
    })
  }

  const clearAll = () => {
    setSelectedColors([])
    setSelectedSizes([])
    setPriceMin("")
    setPriceMax("")
    router.push(pathname)
  }

  const hasFilters =
    selectedColors.length > 0 || selectedSizes.length > 0 || priceMin || priceMax

  const visibleColors = colorsExpanded ? availableColors : availableColors.slice(0, 6)
  const visibleSizes = sizesExpanded ? availableSizes : availableSizes.slice(0, 6)

  const sliderMin = priceMin ? Number(priceMin) : minCalculatedPrice
  const sliderMax = priceMax ? Number(priceMax) : maxCalculatedPrice

  // Conteúdo dos filtros (compartilhado entre Desktop e Mobile Drawer)
  const renderFilterContent = () => (
    <div className="space-y-6">
      {/* ── ORDENAR POR (exibido na gaveta mobile) ── */}
      <div className="small:hidden">
        <SectionTitle>Ordenar por</SectionTitle>
        <select
          value={sortBy}
          onChange={(e) => handleSortChange(e.target.value)}
          className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 uppercase tracking-wide focus:outline-none focus:border-brand-teal cursor-pointer shadow-sm"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="w-full h-px bg-gray-200 my-6" />
      </div>

      {/* ── COR ───────────────────────────────────────── */}
      {availableColors.length > 0 && (
        <div>
          <SectionTitle>Cor</SectionTitle>
          <div className="flex flex-col gap-3">
            {visibleColors.map((color) => {
              const active = selectedColors.includes(color.value)
              return (
                <label
                  key={color.value}
                  className="flex items-center gap-3 cursor-pointer group py-0.5"
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={active}
                    onChange={() => toggleColor(color.value)}
                  />
                  <span
                    className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                      active
                        ? "border-brand-teal bg-brand-teal"
                        : "border-gray-300 bg-white group-hover:border-gray-400"
                    }`}
                  >
                    {active && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        viewBox="0 0 10 10"
                      >
                        <path
                          d="M1.5 5l2.5 2.5 5-5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </span>
                  <span
                    className="w-4 h-4 rounded-full border border-gray-300 shrink-0 shadow-xs inline-block"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span className="text-sm text-gray-800 font-medium group-hover:text-gray-900 transition-colors capitalize">
                    {color.label}
                  </span>
                </label>
              )
            })}
          </div>
          {availableColors.length > 6 && (
            <ShowMoreBtn
              expanded={colorsExpanded}
              onClick={() => setColorsExpanded((v) => !v)}
            />
          )}
        </div>
      )}

      {/* Separador */}
      <div className="w-full h-px bg-gray-200" />

      {/* ── TAMANHO ──────────────────────────────────── */}
      {availableSizes.length > 0 && (
        <div>
          <SectionTitle>Tamanho</SectionTitle>
          <div className="flex flex-col gap-3">
            {visibleSizes.map((size) => {
              const active = selectedSizes.includes(size.value)
              return (
                <label
                  key={size.value}
                  className="flex items-center gap-3 cursor-pointer group py-0.5"
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={active}
                    onChange={() => toggleSize(size.value)}
                  />
                  <span
                    className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                      active
                        ? "border-brand-teal bg-brand-teal"
                        : "border-gray-300 bg-white group-hover:border-gray-400"
                    }`}
                  >
                    {active && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        viewBox="0 0 10 10"
                      >
                        <path
                          d="M1.5 5l2.5 2.5 5-5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </span>
                  <span className="text-sm text-gray-800 font-medium group-hover:text-gray-900 transition-colors uppercase">
                    {size.label}
                  </span>
                </label>
              )
            })}
          </div>
          {availableSizes.length > 6 && (
            <ShowMoreBtn
              expanded={sizesExpanded}
              onClick={() => setSizesExpanded((v) => !v)}
            />
          )}
        </div>
      )}

      {/* Separador */}
      <div className="w-full h-px bg-gray-200" />

      {/* ── PREÇO (Slider Duplo Dinâmico) ─────────────── */}
      <div>
        <SectionTitle>Preço</SectionTitle>

        <PriceRangeSlider
          minVal={sliderMin}
          maxVal={sliderMax}
          minFloor={minCalculatedPrice}
          maxCeil={maxCalculatedPrice}
          onChange={handleSliderChange}
        />
      </div>
    </div>
  )

  return (
    <>
      {/* ── BARRA SUPERIOR MOBILE (Estilo imagem enviada) ──────────────────────── */}
      <div className="small:hidden flex items-center justify-between py-2 border-b border-gray-200 mb-4">
        <h1 className="text-xl font-bold tracking-wider uppercase text-gray-900">
          {categoryName}
        </h1>
        <button
          onClick={() => setMobileDrawerOpen(true)}
          className="flex items-center gap-2 px-5 py-2 rounded-full border border-gray-300 bg-white text-gray-800 font-bold text-xs uppercase tracking-wider shadow-sm hover:border-gray-400 transition-all"
        >
          Filtrar
          <SlidersIcon />
        </button>
      </div>

      {/* ── GAVETA MOBILE SLIDE-OVER (FILTROS) ─────────────────────────────────── */}
      {mobileDrawerOpen && (
        <div className="small:hidden fixed inset-0 z-[100] flex justify-end">
          {/* Backdrop escuro */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileDrawerOpen(false)}
          />

          {/* Conteúdo da gaveta */}
          <div className="relative w-full max-w-xs sm:max-w-sm bg-[#f8f8f8] h-full flex flex-col shadow-2xl z-10 animate-in slide-in-from-right duration-200">
            {/* Cabeçalho da gaveta */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
              <h2 className="text-base font-bold tracking-widest uppercase text-gray-900">
                Filtros
              </h2>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="text-gray-400 hover:text-gray-700 transition-colors p-1"
                aria-label="Fechar filtros"
              >
                <XIcon />
              </button>
            </div>

            {/* Conteúdo rolável */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              {renderFilterContent()}
            </div>

            {/* Rodapé da gaveta */}
            <div className="p-4 border-t border-gray-200 bg-white flex items-center gap-3">
              {hasFilters && (
                <button
                  onClick={clearAll}
                  className="w-1/3 py-3.5 rounded-xl border border-gray-300 text-gray-700 font-bold text-xs uppercase tracking-wider text-center"
                >
                  Limpar
                </button>
              )}
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="flex-1 py-3.5 rounded-xl bg-brand-teal text-white font-bold text-xs uppercase tracking-wider text-center shadow-md hover:bg-brand-teal/90 transition-colors"
              >
                Ver Resultados
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── SIDEBAR DESKTOP ────────────────────────────────────────────────────── */}
      <aside className="hidden small:block w-[200px] shrink-0">
        <div className="flex items-baseline justify-between mb-6">
          <h1 className="text-xl font-bold tracking-[0.08em] uppercase text-gray-900">
            {categoryName}
          </h1>
          {hasFilters && (
            <button
              onClick={clearAll}
              className="text-[10px] text-gray-400 hover:text-gray-600 underline ml-2"
            >
              Limpar
            </button>
          )}
        </div>

        <div className="w-full h-px bg-gray-100 mb-5" />

        <p className="text-xs font-bold text-gray-700 mb-5 tracking-wide uppercase">
          Filtrar por
        </p>

        {renderFilterContent()}
      </aside>
    </>
  )
}
