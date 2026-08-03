import { Metadata } from "next"
import { notFound } from "next/navigation"
import { Suspense } from "react"

import { getCategoryByHandle } from "@lib/data/categories"
import { getCategoryFilterOptions } from "@lib/data/products"
import { resolveOptionValueIds } from "@lib/util/product-option-filters"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import CategorySidebar from "@modules/categories/components/category-sidebar"
import CategorySortDropdown from "@modules/categories/components/category-sort-dropdown"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { getSubcategoryBySlugs } from "@lib/constants/nav-categories"

type Props = {
  params: Promise<{ countryCode: string; categoria: string; subcategoria: string }>
  searchParams: Promise<
    Record<string, string | string[] | undefined> & {
      sortBy?: SortOptions
      page?: string
      color?: string | string[]
      size?: string | string[]
      optionValueIds?: string | string[]
    }
  >
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const config = getSubcategoryBySlugs(params.categoria, params.subcategoria)

  if (!config?.subcategory) return {}

  return {
    title: `${config.subcategory.name} - ${config.category.name} | Louise Castelatto`,
    description: `Compre ${config.subcategory.name} na Louise Castelatto.`,
  }
}

export default async function SubcategoryPage(props: Props) {
  const params = await props.params
  const searchParams = await props.searchParams

  const config = getSubcategoryBySlugs(params.categoria, params.subcategoria)
  if (!config?.subcategory) {
    notFound()
  }

  const { category, subcategory } = config
  const { sortBy, page } = searchParams
  const sort: SortOptions = sortBy || "created_at"
  const pageNumber = page ? parseInt(page) : 1

  // Tenta buscar a categoria correspondente no Medusa pelo handle (slug da subcategoria)
  const medusaCategory = await getCategoryByHandle([subcategory.slug]).catch(() => null)

  const filterData = await getCategoryFilterOptions({
    categoryId: medusaCategory?.id,
    allowedJeansColorsOnly: subcategory.allowedJeansColorsOnly,
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
          categoryName={subcategory.name}
          subcategorySlug={subcategory.slug}
          allowedJeansColorsOnly={subcategory.allowedJeansColorsOnly}
          categoryId={medusaCategory?.id}
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
        {/* Topo: Breadcrumb + Ordenação (Visível apenas em telas Desktop/Small+) */}
        <div className="hidden small:flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2 text-[12px] text-gray-400 flex-wrap">
            <LocalizedClientLink href="/" className="hover:text-gray-600 transition-colors">
              Início
            </LocalizedClientLink>
            <span>/</span>
            <LocalizedClientLink href="/roupas" className="hover:text-gray-600 transition-colors">
              Roupas
            </LocalizedClientLink>
            <span>/</span>
            <LocalizedClientLink href={category.href} className="hover:text-gray-600 transition-colors">
              {category.name}
            </LocalizedClientLink>
            <span>/</span>
            <span className="text-gray-800 font-medium">{subcategory.name}</span>
          </div>

          <Suspense fallback={<div className="w-32 h-8 bg-gray-100 rounded animate-pulse" />}>
            <CategorySortDropdown sortBy={sort} />
          </Suspense>
        </div>

        {/* Subcategorias irmãs (pills maiores no mobile) */}
        <div className="flex flex-wrap gap-2.5 mb-6">
          {category.subcategories.map((sub) => {
            const isActive = sub.slug === subcategory.slug
            return (
              <LocalizedClientLink
                key={sub.slug}
                href={sub.href}
                className={`px-4 py-2 sm:px-3 sm:py-1.5 text-xs sm:text-[11px] font-semibold border rounded-full transition-all shadow-sm ${
                  isActive
                    ? "border-brand-teal bg-brand-teal text-white shadow-brand-teal/20"
                    : "border-gray-200 bg-white text-gray-700 hover:border-brand-teal hover:text-brand-teal"
                }`}
              >
                {sub.name}
              </LocalizedClientLink>
            )
          })}
        </div>

        {/* Grade de Produtos */}
        <Suspense fallback={<SkeletonProductGrid />}>
          <PaginatedProducts
            sortBy={sort}
            page={pageNumber}
            categoryId={medusaCategory?.id}
            countryCode={params.countryCode}
            optionValueIds={optionValueIds}
          />
        </Suspense>
      </div>
    </div>
  )
}
