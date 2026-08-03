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
import { MAIN_CATEGORIES } from "@lib/constants/nav-categories"

export const metadata: Metadata = {
  title: "Roupas | Louise Castelatto",
  description:
    "Explore toda a coleção de roupas Louise Castelatto — blusas, vestidos, conjuntos, calças, shorts e saias.",
}

type SearchParams = Record<string, string | string[] | undefined> & {
  sortBy?: SortOptions
  page?: string
  color?: string | string[]
  size?: string | string[]
  optionValueIds?: string | string[]
}

type Props = {
  searchParams: Promise<SearchParams>
  params: Promise<{ countryCode: string }>
}

export default async function RoupasPage(props: Props) {
  const params = await props.params
  const searchParams = await props.searchParams
  const { sortBy, page } = searchParams
  const sort: SortOptions = sortBy || "created_at"
  const pageNumber = page ? parseInt(page) : 1

  const filterData = await getCategoryFilterOptions({
    countryCode: params.countryCode,
  })
  const optionValueIds = resolveOptionValueIds(searchParams, filterData.optionValueMap)

  return (
    <div className="flex flex-col small:flex-row gap-8 py-8 px-4 small:px-8 max-w-[1400px] mx-auto w-full min-h-screen">
      {/* ── Sidebar ──────────────────────────────────────────────────── */}
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
          categoryName="Roupas"
          countryCode={params.countryCode}
          availableColors={filterData.availableColors}
          availableSizes={filterData.availableSizes}
          minCalculatedPrice={filterData.minCalculatedPrice}
          maxCalculatedPrice={filterData.maxCalculatedPrice}
        />
      </Suspense>

      {/* ── Conteúdo principal ───────────────────────────────────────── */}
      <div className="flex-1 min-w-0">
        {/* Barra topo: breadcrumb / sort */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2 text-[12px] text-gray-400">
            <span className="hover:text-gray-600 cursor-pointer">Início</span>
            <span>/</span>
            <span className="text-gray-700 font-medium">Roupas</span>
          </div>
          <Suspense fallback={<div className="w-32 h-8 bg-gray-100 rounded animate-pulse" />}>
            <CategorySortDropdown sortBy={sort} />
          </Suspense>
        </div>

        {/* Categorias pill links */}
        <div className="flex flex-wrap gap-2 mb-6">
          <LocalizedClientLink
            href="/roupas"
            className="px-3 py-1.5 text-[11px] font-medium border rounded-full transition-colors duration-150 border-brand-teal bg-brand-teal text-white"
          >
            Todas
          </LocalizedClientLink>
          {MAIN_CATEGORIES.map((cat) => (
            <LocalizedClientLink
              key={cat.slug}
              href={cat.href}
              className="px-3 py-1.5 text-[11px] font-medium border rounded-full transition-colors duration-150 border-gray-200 text-gray-600 hover:border-brand-teal hover:text-brand-teal"
            >
              {cat.name}
            </LocalizedClientLink>
          ))}
        </div>

        {/* Grade de produtos */}
        <Suspense fallback={<SkeletonProductGrid />}>
          <PaginatedProducts
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
