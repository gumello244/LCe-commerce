import { getCategoryByHandle } from "@lib/data/categories"
import { listProducts } from "@lib/data/products"
import CategoryShowcaseClient from "./category-showcase-client"

type CategoryShowcaseProps = {
  countryCode: string
}

export default async function CategoryShowcase({ countryCode }: CategoryShowcaseProps) {
  // 1. Buscar a categoria "Vestidos" e suas subcategorias (Longo, Curto, Midi, Justo, Solto)
  const category = await getCategoryByHandle(["vestidos"]).catch(() => null)

  const categoryIds = category
    ? [category.id, ...(category.category_children?.map((c) => c.id) || [])]
    : undefined

  // 2. Buscar os produtos dos vestidos com todas as variantes de preços, fotos e opções de cores
  const {
    response: { products },
  } = await listProducts({
    countryCode,
    queryParams: {
      ...(categoryIds ? { category_id: categoryIds } : {}),
      limit: 12,
      fields: "*variants.calculated_price, *images, *options, *options.values",
    },
  }).catch(() => ({
    response: { products: [] },
  }))

  // Se não encontrar por categoria específica, busca os produtos gerais para manter a vitrine ativa
  let displayProducts = products
  if (!displayProducts || displayProducts.length === 0) {
    const fallbackResponse = await listProducts({
      countryCode,
      queryParams: {
        limit: 12,
        fields: "*variants.calculated_price, *images, *options, *options.values",
      },
    }).catch(() => ({ response: { products: [] } }))
    displayProducts = fallbackResponse.response.products
  }

  if (!displayProducts || displayProducts.length === 0) {
    return null
  }

  return (
    <CategoryShowcaseClient
      initialProducts={displayProducts}
      activeCategoryHandle="vestidos"
      countryCode={countryCode}
    />
  )
}
