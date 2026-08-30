import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { getCacheOptions } from "./cookies"

export const listCategories = async (query?: Record<string, unknown>) => {
  const next = {
    ...(await getCacheOptions("categories")),
  }

  const limit = query?.limit || 100

  return sdk.client
    .fetch<{ product_categories: HttpTypes.StoreProductCategory[] }>(
      "/store/product-categories",
      {
        query: {
          fields:
            "*category_children, *products, *parent_category, *parent_category.parent_category",
          limit,
          ...query,
        },
        next,
        cache:
          process.env.NODE_ENV === "development" ? "no-store" : "force-cache",
      }
    )
    .then(({ product_categories }) => product_categories)
    .catch((err) => {
      console.error("Error in listCategories fetch:", err)
      return []
    })
}

export const getCategoryByHandle = async (categoryHandle: string[]) => {
  const leafHandle = categoryHandle[categoryHandle.length - 1]
  const fullHandle = categoryHandle.join("/")

  const next = {
    ...(await getCacheOptions("categories")),
  }

  const fetchByHandle = async (h: string) => {
    return sdk.client
      .fetch<HttpTypes.StoreProductCategoryListResponse>(
        `/store/product-categories`,
        {
          query: {
            fields: "*category_children, *products",
            handle: h,
          },
          next,
          cache:
            process.env.NODE_ENV === "development" ? "no-store" : "force-cache",
        }
      )
      .then(({ product_categories }) => product_categories[0] || null)
      .catch((err) => {
        console.error(`Error in getCategoryByHandle (${h}) fetch:`, err)
        return null
      })
  }

  const category = await fetchByHandle(leafHandle)
  if (category) return category
  if (leafHandle !== fullHandle) {
    return await fetchByHandle(fullHandle)
  }
  return null
}
