import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"

export default async function ProductPreview({
  product,
  isFeatured,
  region: _region,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}) {
  const { cheapestPrice } = getProductPrice({
    product,
  })

  return (
    <LocalizedClientLink
      href={`/products/${product.handle}`}
      className="group flex flex-col"
      data-testid="product-preview-link"
    >
      {/* ── Thumbnail ── */}
      <div className="relative overflow-hidden rounded-sm bg-gray-50">
        <div className="transition-transform duration-500 ease-out group-hover:scale-105">
          <Thumbnail
            thumbnail={product.thumbnail}
            images={product.images}
            size="full"
            isFeatured={isFeatured}
          />
        </div>
      </div>

      {/* ── Info ── */}
      <div className="mt-3 flex flex-col gap-1" data-testid="product-wrapper">
        <p
          className="text-[11px] font-bold tracking-[0.06em] uppercase text-gray-800 leading-snug line-clamp-2"
          data-testid="product-title"
        >
          {product.title}
        </p>
        <div className="flex items-center gap-2" data-testid="product-price">
          {cheapestPrice && <PreviewPrice price={cheapestPrice} />}
        </div>
      </div>
    </LocalizedClientLink>
  )
}
