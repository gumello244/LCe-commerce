"use server"

import { sdk } from "@lib/config"
import { OptionValueIds } from "@lib/util/product-option-filters"
import { sortProducts } from "@lib/util/sort-products"
import { HttpTypes } from "@medusajs/types"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { getAuthHeaders, getCacheOptions } from "./cookies"
import { getRegion, retrieveRegion } from "./regions"

type ProductListQueryParams = (HttpTypes.FindParams &
  HttpTypes.StoreProductListParams) & {
  options?: string[]
  option_value_id?: string | string[]
}

export const listProducts = async ({
  pageParam = 1,
  queryParams,
  countryCode,
  regionId,
}: {
  pageParam?: number
  queryParams?: ProductListQueryParams
  countryCode?: string
  regionId?: string
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number }
  nextPage: number | null
  queryParams?: ProductListQueryParams
}> => {
  if (!countryCode && !regionId) {
    throw new Error("Country code or region ID is required")
  }

  const limit = queryParams?.limit || 12
  const _pageParam = Math.max(pageParam, 1)
  const offset = _pageParam === 1 ? 0 : (_pageParam - 1) * limit

  let region: HttpTypes.StoreRegion | undefined | null

  if (countryCode) {
    region = await getRegion(countryCode)
  } else {
    region = await retrieveRegion(regionId!)
  }

  if (!region) {
    return {
      response: { products: [], count: 0 },
      nextPage: null,
    }
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("products")),
  }

  const cacheMode =
    process.env.NODE_ENV === "development" ? "no-store" : "force-cache"

  return sdk.client
    .fetch<{ products: HttpTypes.StoreProduct[]; count: number }>(
      `/store/products`,
      {
        method: "GET",
        query: {
          limit,
          offset,
          region_id: region?.id,
          fields:
            "*variants.calculated_price,*variants.images,*variants.options,+metadata,+tags,",
          ...queryParams,
        },
        headers,
        next,
        cache: cacheMode,
      }
    )
    .then(({ products, count }) => {
      const nextPage = count > offset + limit ? pageParam + 1 : null

      return {
        response: {
          products,
          count,
        },
        nextPage: nextPage,
        queryParams,
      }
    })
    .catch((err) => {
      console.error("Error in listProducts fetch:", err)
      return {
        response: {
          products: [],
          count: 0,
        },
        nextPage: null,
        queryParams,
      }
    })
}

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

// Normaliza nomes de cores em inglês para português para manter consistência na UI
const COLOR_EN_TO_PT: Record<string, string> = {
  black: "preto",
  white: "branco",
  red: "vermelho",
  blue: "azul",
  green: "verde",
  pink: "rosa",
  beige: "bege",
  brown: "marrom",
  gray: "cinza",
  grey: "cinza",
  yellow: "amarelo",
  orange: "laranja",
  purple: "roxo",
  offwhite: "off white",
}

// Normaliza nomes de tamanhos em inglês para padrão PT/numérico
const SIZE_EN_TO_PT: Record<string, string> = {
  xs: "PP",
  s: "P",
  m: "M",
  l: "G",
  xl: "GG",
  xxl: "GG",
  "2xl": "GG",
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

export type CategoryFilterData = {
  availableColors: { label: string; value: string; hex: string }[]
  availableSizes: { label: string; value: string }[]
  minCalculatedPrice: number
  maxCalculatedPrice: number
  optionValueMap: Record<string, string[]>
}

export const getCategoryFilterOptions = async ({
  categoryId,
  allowedJeansColorsOnly,
  countryCode,
  regionId,
  q,
}: {
  categoryId?: string
  allowedJeansColorsOnly?: boolean
  countryCode?: string
  regionId?: string
  q?: string
}): Promise<CategoryFilterData> => {
  const colorMap = new Map<string, { label: string; value: string; hex: string }>()
  const sizeMap = new Map<string, { label: string; value: string }>()
  const optionValueMap: Record<string, string[]> = {}
  let lowestPrice: number | null = null
  let highestPrice: number | null = null

  let region: HttpTypes.StoreRegion | undefined | null
  if (countryCode) {
    region = await getRegion(countryCode)
  } else if (regionId) {
    region = await retrieveRegion(regionId)
  } else {
    region = await getRegion(process.env.NEXT_PUBLIC_DEFAULT_REGION || "br")
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  try {
    const query: Record<string, unknown> = {
      fields: "*options,*options.values,*variants,*variants.calculated_price",
      limit: 100,
    }

    if (region?.id) {
      query.region_id = region.id
    }
    if (categoryId) {
      query.category_id = [categoryId]
    }
    if (q) {
      query.q = q
    }

    const res = await sdk.client.fetch<{ products: HttpTypes.StoreProduct[] }>(
      "/store/products",
      {
        query,
        headers,
        next:
          process.env.NODE_ENV === "development"
            ? { revalidate: 0 }
            : { revalidate: 3600 },
        cache:
          process.env.NODE_ENV === "development" ? "no-store" : "force-cache",
      }
    )

      const products = res.products || []

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
              const valId = val.id

              // Normalizar inglês → português
              const normalizedKey = COLOR_EN_TO_PT[valLower] || valLower
              const normalizedLabel =
                COLOR_EN_TO_PT[valLower]
                  ? normalizedKey.charAt(0).toUpperCase() + normalizedKey.slice(1)
                  : valStr

              if (allowedJeansColorsOnly && !normalizedKey.includes("jeans")) {
                return
              }

              if (valId) {
                if (!optionValueMap[normalizedKey]) {
                  optionValueMap[normalizedKey] = []
                }
                if (!optionValueMap[normalizedKey].includes(valId)) {
                  optionValueMap[normalizedKey].push(valId)
                }
              }

              if (!colorMap.has(normalizedKey)) {
                colorMap.set(normalizedKey, {
                  label: normalizedLabel,
                  value: normalizedKey,
                  hex: COLOR_HEX_MAP[normalizedKey] || "#cccccc",
                })
              }
            })
          } else if (titleLower.includes("tamanho") || titleLower.includes("size")) {
            opt.values?.forEach((val) => {
              const valStr = val.value?.trim() || ""
              const valLower = valStr.toLowerCase()
              const valId = val.id

              // Normalizar tamanhos em inglês para PT (S→P, M→M, L→G, XL→GG)
              const normalizedKey = SIZE_EN_TO_PT[valLower] || valStr
              const normalizedKeyLower = normalizedKey.toLowerCase()

              if (valId) {
                if (!optionValueMap[normalizedKeyLower]) {
                  optionValueMap[normalizedKeyLower] = []
                }
                if (!optionValueMap[normalizedKeyLower].includes(valId)) {
                  optionValueMap[normalizedKeyLower].push(valId)
                }
              }

              if (!sizeMap.has(normalizedKeyLower)) {
                sizeMap.set(normalizedKeyLower, {
                  label: normalizedKey,
                  value: normalizedKeyLower,
                })
              }
            })
          }
        })
      })
    } catch (err) {
      console.error("Erro ao buscar opções de filtros no servidor:", err)
    }

  let availableColors = Array.from(colorMap.values())
  if (availableColors.length === 0) {
    if (allowedJeansColorsOnly) {
      availableColors = [
        { label: "Jeans Claro", value: "jeans claro", hex: "#A2C4E5" },
        { label: "Jeans Médio", value: "jeans médio", hex: "#5B8FB9" },
        { label: "Jeans Escuro", value: "jeans escuro", hex: "#2B4C7E" },
      ]
    } else {
      availableColors = DEFAULT_FALLBACK_COLORS
    }
  }

  let availableSizes = Array.from(sizeMap.values())
  if (availableSizes.length === 0) {
    availableSizes = DEFAULT_FALLBACK_SIZES.map((s) => ({ label: s, value: s }))
  }

  const minCalculatedPrice = lowestPrice !== null ? lowestPrice : 0
  const maxCalculatedPrice =
    highestPrice !== null ? Math.max(highestPrice, minCalculatedPrice + 100) : 500

  return {
    availableColors,
    availableSizes,
    minCalculatedPrice,
    maxCalculatedPrice,
    optionValueMap,
  }
}

/**
 * Buscas paginadas com ordenação.
 * Para ordenação padrão ('created_at'), faz consulta nativa direta de 12 itens.
 * Para ordenação por preço, busca até 100 itens (corrigindo pageParam: 1) e ordena em memória.
 */
export const listProductsWithSort = async ({
  page = 1,
  queryParams,
  sortBy = "created_at",
  countryCode,
  optionValueIds,
}: {
  page?: number
  queryParams?: ProductListQueryParams
  sortBy?: SortOptions
  countryCode: string
  optionValueIds?: OptionValueIds
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number }
  nextPage: number | null
  queryParams?: ProductListQueryParams
}> => {
  const limit = queryParams?.limit || 12
  const currentPage = Math.max(page || 1, 1)
  const optionFilters = Array.from(
    new Set((optionValueIds || []).filter(Boolean))
  )

  if (sortBy === "created_at") {
    const { response, nextPage } = await listProducts({
      pageParam: currentPage,
      queryParams: {
        ...queryParams,
        ...(optionFilters.length ? { option_value_id: optionFilters } : {}),
        limit,
        order: "-created_at",
      },
      countryCode,
    })

    return {
      response,
      nextPage,
      queryParams,
    }
  }

  const {
    response: { products },
  } = await listProducts({
    pageParam: 1,
    queryParams: {
      ...queryParams,
      ...(optionFilters.length ? { option_value_id: optionFilters } : {}),
      limit: 100,
    },
    countryCode,
  })

  const sortedProducts = sortProducts(products, sortBy)
  const offset = (currentPage - 1) * limit
  const filteredCount = products.length
  const nextPage = filteredCount > offset + limit ? currentPage + 1 : null
  const paginatedProducts = sortedProducts.slice(offset, offset + limit)

  return {
    response: {
      products: paginatedProducts,
      count: filteredCount,
    },
    nextPage,
    queryParams,
  }
}

