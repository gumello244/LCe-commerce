import { notFound } from "next/navigation"
import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { HttpTypes } from "@medusajs/types"
import { OptionValueIds } from "@lib/util/product-option-filters"
import { getCategoryFilterOptions } from "@lib/data/products"
import CategorySidebar from "@modules/categories/components/category-sidebar"
import CategorySortDropdown from "@modules/categories/components/category-sort-dropdown"

export default async function CategoryTemplate({
  category,
  sortBy,
  page,
  countryCode,
  optionValueIds,
}: {
  category: HttpTypes.StoreProductCategory
  sortBy?: SortOptions
  page?: string
  countryCode: string
  optionValueIds?: OptionValueIds
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  if (!category || !countryCode) notFound()

  const categoryIds = [
    category.id,
    ...(category.category_children?.map((c) => c.id) || []),
  ]

  const filterData = await getCategoryFilterOptions({
    categoryId: categoryIds,
    countryCode,
  })

  return (
    <div
      className="flex flex-col small:flex-row gap-8 py-8 px-4 small:px-8 max-w-[1400px] mx-auto w-full"
      data-testid="category-container"
    >
      {/* ── Sidebar ──────────────────────────────────────────────── */}
      <Suspense
        fallback={
          <div className="w-[200px] shrink-0 animate-pulse">
            <div className="h-6 bg-gray-100 rounded mb-4 w-3/4" />
            <div className="h-px bg-gray-100 mb-4" />
            <div className="space-y-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-100 rounded w-full" />
              ))}
            </div>
          </div>
        }
      >
        <CategorySidebar
          categoryName={category.name}
          categoryId={category.id}
          countryCode={countryCode}
          sortBy={sort}
          availableColors={filterData.availableColors}
          availableSizes={filterData.availableSizes}
          minCalculatedPrice={filterData.minCalculatedPrice}
          maxCalculatedPrice={filterData.maxCalculatedPrice}
        />
      </Suspense>

      {/* ── Main content ─────────────────────────────────────────── */}
      <div className="flex-1 min-w-0">
        {/* Top bar: count + sort */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-[13px] text-gray-400 font-medium">
            {category.products?.length
              ? `${category.products.length} produto${category.products.length !== 1 ? "s" : ""}`
              : ""}
          </p>
          <Suspense fallback={null}>
            <CategorySortDropdown sortBy={sort} />
          </Suspense>
        </div>

        {/* Subcategories */}
        {category.category_children && category.category_children.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {category.category_children.map((c) => (
              <a
                key={c.id}
                href={`/categories/${c.handle}`}
                className="px-3 py-1.5 text-[12px] border border-gray-200 rounded-full text-gray-600 hover:border-brand-teal hover:text-brand-teal transition-colors"
              >
                {c.name}
              </a>
            ))}
          </div>
        )}

        {/* Product grid */}
        <Suspense
          fallback={
            <SkeletonProductGrid
              numberOfProducts={category.products?.length ?? 8}
            />
          }
        >
          <PaginatedProducts
            sortBy={sort}
            page={pageNumber}
            categoryId={categoryIds}
            countryCode={countryCode}
            optionValueIds={optionValueIds}
          />
        </Suspense>
      </div>
    </div>
  )
}
