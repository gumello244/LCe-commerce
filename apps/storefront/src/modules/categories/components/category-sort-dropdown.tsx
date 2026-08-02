"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

const sortOptions: { value: SortOptions; label: string }[] = [
  { value: "created_at", label: "Mais recentes" },
  { value: "price_asc", label: "Preço: Menor → Maior" },
  { value: "price_desc", label: "Preço: Maior → Menor" },
]

export default function CategorySortDropdown({
  sortBy,
}: {
  sortBy: SortOptions
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleChange = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set("sortBy", value)
      params.delete("page")
      router.push(`${pathname}?${params.toString()}`)
    },
    [pathname, router, searchParams]
  )

  return (
    <div className="relative">
      <select
        value={sortBy}
        onChange={(e) => handleChange(e.target.value)}
        className="appearance-none bg-white border border-gray-200 rounded text-[12px] text-gray-700 font-medium pl-3 pr-8 py-2 focus:outline-none focus:border-brand-teal cursor-pointer hover:border-gray-300 transition-colors"
      >
        {sortOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {/* Custom arrow */}
      <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400">
        <svg
          className="w-3.5 h-3.5"
          fill="none"
          viewBox="0 0 14 14"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 5l4 4 4-4" />
        </svg>
      </span>
    </div>
  )
}
