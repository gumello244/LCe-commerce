import { Metadata } from "next"
import { Suspense } from "react"

import { getCategoryFilterOptions } from "@lib/data/products"
import { resolveOptionValueIds } from "@lib/util/product-option-filters"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import CategorySidebar from "@modules/categories/components/category-sidebar"
import CategorySortDropdown from "@modules/categories/components/category-sort-dropdown"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type Props = {
  params: Promise<{ countryCode: string }>
  searchParams: Promise<
    Record<string, string | string[] | undefined> & {
      q?: string
      sortBy?: SortOptions
      page?: string
      color?: string | string[]
      size?: string | string[]
      optionValueIds?: string | string[]
    }
  >
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const searchParams = await props.searchParams
  const query = searchParams.q ? `"${searchParams.q}"` : "Produtos"

  return {
    title: `Busca por ${query} | Louise Castelatto`,
    description: `Resultados da busca por ${query} no e-commerce Louise Castelatto.`,
  }
}

export default async function SearchPage(props: Props) {
  const params = await props.params
  const searchParams = await props.searchParams
  const query = (typeof searchParams.q === "string" ? searchParams.q : "").trim()
  const { sortBy, page } = searchParams
  const sort: SortOptions = sortBy || "created_at"
  const pageNumber = page ? parseInt(page) : 1

  const filterData = await getCategoryFilterOptions({
    q: query || undefined,
    countryCode: params.countryCode,
  })
  const optionValueIds = resolveOptionValueIds(searchParams, filterData.optionValueMap)

  return (
    <div className="flex flex-col small:flex-row gap-8 py-8 px-4 small:px-8 max-w-[1400px] mx-auto w-full min-h-screen">
      {/* ── Sidebar de Filtros ────────────────────────────────────────── */}
      <Suspense
        fallback={
          <div className="w-[200px] shrink-0 animate-pulse space-y-3">
            <div className="h-6 bg-gray-100 rounded w-3/4" />
            <div className="h-px bg-gray-100" />
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-3.5 bg-gray-100 rounded w-full" />
            ))}
          </div>
        }
      >
        <CategorySidebar
          categoryName={query ? `Busca: "${query}"` : "Busca"}
          countryCode={params.countryCode}
          sortBy={sort}
          availableColors={filterData.availableColors}
          availableSizes={filterData.availableSizes}
          minCalculatedPrice={filterData.minCalculatedPrice}
          maxCalculatedPrice={filterData.maxCalculatedPrice}
        />
      </Suspense>

      {/* ── Conteúdo Principal ────────────────────────────────────────── */}
      <div className="flex-1 min-w-0">
        {/* Topo: Breadcrumb + Titulo + Ordenação */}
        <div className="flex flex-col gap-3 mb-6 pb-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[12px] text-gray-400">
              <LocalizedClientLink href="/" className="hover:text-gray-600 transition-colors">
                Início
              </LocalizedClientLink>
              <span>/</span>
              <span className="text-gray-700 font-medium">Busca</span>
            </div>
            <Suspense fallback={<div className="w-32 h-8 bg-gray-100 rounded animate-pulse" />}>
              <CategorySortDropdown sortBy={sort} />
            </Suspense>
          </div>

          <div className="mt-1">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              {query ? (
                <>
                  Resultados para <span className="text-brand-teal font-extrabold">&ldquo;{query}&rdquo;</span>
                </>
              ) : (
                "Todos os produtos"
              )}
            </h1>
          </div>
        </div>

        {/* Grade de Produtos */}
        <Suspense fallback={<SkeletonProductGrid />}>
          <PaginatedProducts
            q={query || undefined}
            sortBy={sort}
            page={pageNumber}
            countryCode={params.countryCode}
            optionValueIds={optionValueIds}
          />
        </Suspense>
      </div>
    </div>
  )
}
