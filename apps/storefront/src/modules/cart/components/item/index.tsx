"use client"

import { deleteLineItem, updateLineItem } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import ErrorMessage from "@modules/checkout/components/error-message"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LineItemUnitPrice from "@modules/common/components/line-item-unit-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Table, Text } from "@modules/common/components/ui"
import Spinner from "@modules/common/icons/spinner"
import Thumbnail from "@modules/products/components/thumbnail"
import { useState } from "react"

type ItemProps = {
  item: HttpTypes.StoreCartLineItem
  type?: "full" | "preview"
  currencyCode: string
}

const Item = ({ item, type = "full", currencyCode }: ItemProps) => {
  const [updating, setUpdating] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const changeQuantity = async (quantity: number) => {
    if (quantity < 1) return
    setError(null)
    setUpdating(true)

    await updateLineItem({
      lineId: item.id,
      quantity,
    })
      .catch((err) => {
        setError(err.message)
      })
      .finally(() => {
        setUpdating(false)
      })
  }

  const handleDelete = async () => {
    setError(null)
    setDeleting(true)
    await deleteLineItem(item.id)
      .catch((err) => {
        setError(err.message)
      })
      .finally(() => {
        setDeleting(false)
      })
  }

  if (type === "preview") {
    return (
      <Table.Row className="w-full" data-testid="product-row">
        <Table.Cell className="!pl-0 p-2 w-16">
          <LocalizedClientLink
            href={`/products/${item.product_handle}`}
            className="flex w-14 aspect-[3/4]"
          >
            <Thumbnail
              thumbnail={item.thumbnail}
              images={item.variant?.product?.images}
              size="square"
            />
          </LocalizedClientLink>
        </Table.Cell>

        <Table.Cell className="text-left">
          <Text className="txt-medium-plus text-gray-900 font-semibold text-xs" data-testid="product-title">
            {item.product_title}
          </Text>
          <LineItemOptions variant={item.variant} data-testid="product-variant" />
        </Table.Cell>

        <Table.Cell className="!pr-0 text-right">
          <span className="flex flex-col items-end h-full justify-center text-xs">
            <span className="flex gap-x-1">
              <Text className="text-gray-500">{item.quantity}x </Text>
              <LineItemUnitPrice item={item} style="tight" currencyCode={currencyCode} />
            </span>
            <LineItemPrice item={item} style="tight" currencyCode={currencyCode} />
          </span>
        </Table.Cell>
      </Table.Row>
    )
  }

  return (
    <Table.Row className="w-full border-b border-gray-100 py-4" data-testid="product-row">
      {/* ── Column 1: Product Thumbnail & Info (PRODUTO) ──────────────── */}
      <Table.Cell className="!pl-0 py-4 align-top">
        <div className="flex gap-3 sm:gap-4 items-start">
          <LocalizedClientLink
            href={`/products/${item.product_handle}`}
            className="w-16 sm:w-20 aspect-[3/4] rounded-xl overflow-hidden shrink-0 border border-gray-200/80 bg-gray-50 shadow-2xs"
          >
            <Thumbnail
              thumbnail={item.thumbnail}
              images={item.variant?.product?.images}
              size="full"
            />
          </LocalizedClientLink>

          <div className="flex flex-col gap-1">
            <LocalizedClientLink
              href={`/products/${item.product_handle}`}
              className="text-xs sm:text-sm font-bold text-gray-900 hover:text-brand-teal transition-colors leading-snug"
              data-testid="product-title"
            >
              {item.product_title}
            </LocalizedClientLink>

            <LineItemOptions variant={item.variant} data-testid="product-variant" />

            <div className="pt-0.5 text-xs font-semibold text-gray-800">
              <LineItemUnitPrice item={item} style="tight" currencyCode={currencyCode} />
            </div>
          </div>
        </div>
      </Table.Cell>

      {/* ── Column 2: Quantity Control & Remover (QUANTIDADE) ─────────── */}
      <Table.Cell className="align-top py-4 text-center">
        <div className="flex flex-col items-center gap-1.5 min-w-[100px]">
          <div className="flex items-center border border-gray-300 rounded-lg bg-white h-8 px-2 shrink-0 shadow-2xs">
            <button
              type="button"
              onClick={() => changeQuantity(item.quantity - 1)}
              disabled={updating || deleting || item.quantity <= 1}
              className="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-black font-bold text-xs disabled:opacity-30 cursor-pointer"
            >
              -
            </button>
            <span className="w-7 text-center text-xs font-bold text-gray-900">
              {updating ? <Spinner /> : item.quantity}
            </span>
            <button
              type="button"
              onClick={() => changeQuantity(item.quantity + 1)}
              disabled={updating || deleting}
              className="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-black font-bold text-xs disabled:opacity-30 cursor-pointer"
            >
              +
            </button>
          </div>

          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting || updating}
            className="text-[11px] text-gray-500 hover:text-red-600 underline underline-offset-2 transition-colors cursor-pointer disabled:opacity-50"
            data-testid="product-delete-button"
          >
            {deleting ? "Removendo..." : "Remover"}
          </button>
        </div>
        <ErrorMessage error={error} data-testid="product-error-message" />
      </Table.Cell>

      {/* ── Column 3: Total Price (TOTAL) ────────────────────────────── */}
      <Table.Cell className="align-top py-4 text-right !pr-0">
        <div className="text-xs sm:text-sm font-bold text-gray-900 pt-1">
          <LineItemPrice item={item} style="tight" currencyCode={currencyCode} />
        </div>
      </Table.Cell>
    </Table.Row>
  )
}

export default Item

