"use client"

import repeat from "@lib/util/repeat"
import { HttpTypes } from "@medusajs/types"
import Item from "@modules/cart/components/item"
import { Table } from "@modules/common/components/ui"
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"
import { useState } from "react"

type ItemsTemplateProps = {
  cart?: HttpTypes.StoreCart
}

const ItemsTemplate = ({ cart }: ItemsTemplateProps) => {
  const items = cart?.items
  const [cep, setCep] = useState("")
  const [shippingOpen, setShippingOpen] = useState(false)
  const [shippingCalculated, setShippingCalculated] = useState(false)

  const handleCalculateShipping = (e: React.FormEvent) => {
    e.preventDefault()
    if (cep.trim().length >= 8) {
      setShippingCalculated(true)
    }
  }

  return (
    <div className="flex flex-col gap-y-6 w-full">
      {/* ── Cart Items Box ───────────────────────────────────────────── */}
      <div className="border border-gray-200/80 rounded-2xl bg-white p-4 sm:p-6 shadow-2xs">
        <Table>
          <Table.Header className="border-b border-gray-100">
            <Table.Row className="text-gray-400 font-bold uppercase text-[11px] tracking-wider">
              <Table.HeaderCell className="!pl-0 pb-3">PRODUTO</Table.HeaderCell>
              <Table.HeaderCell className="pb-3 text-center">QUANTIDADE</Table.HeaderCell>
              <Table.HeaderCell className="!pr-0 pb-3 text-right">TOTAL</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body className="divide-y divide-gray-100">
            {items
              ? items
                  .sort((a, b) => {
                    return (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
                  })
                  .map((item) => {
                    return (
                      <Item
                        key={item.id}
                        item={item}
                        currencyCode={cart?.currency_code ?? "BRL"}
                      />
                    )
                  })
              : repeat(3).map((i) => {
                  return <SkeletonLineItem key={i} />
                })}
          </Table.Body>
        </Table>

        {/* ── Accordion: CALCULAR FRETE ───────────────────────────────── */}
        <div className="mt-4 pt-2 border-t border-gray-100">
          <button
            type="button"
            onClick={() => setShippingOpen(!shippingOpen)}
            className="w-full flex items-center justify-between p-3.5 rounded-xl bg-gray-50/70 hover:bg-gray-100/80 transition-colors text-xs font-bold text-gray-800 uppercase tracking-wide cursor-pointer"
          >
            <span>CALCULAR FRETE</span>
            <svg
              className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${
                shippingOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {shippingOpen && (
            <div className="p-4 mt-2 bg-gray-50/50 rounded-xl border border-gray-100 animate-fade-in space-y-3">
              <form onSubmit={handleCalculateShipping} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Digite seu CEP (ex: 01001-000)"
                  value={cep}
                  onChange={(e) => setCep(e.target.value)}
                  maxLength={9}
                  className="flex-1 px-3.5 py-2 text-xs border border-gray-300 rounded-lg bg-white focus:outline-none focus:border-brand-teal"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-gray-900 hover:bg-black text-white font-bold text-xs rounded-lg uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Calcular
                </button>
              </form>

              {shippingCalculated && (
                <div className="text-xs space-y-1.5 text-gray-700 pt-2 border-t border-gray-200/60">
                  <div className="flex justify-between items-center">
                    <span>Entrega Padrão (SEDEX / PAC):</span>
                    <span className="font-bold text-gray-900">R$ 14,90 (3 a 5 dias úteis)</span>
                  </div>
                  <div className="flex justify-between items-center text-emerald-700 font-semibold">
                    <span>Compras acima de R$ 200,00:</span>
                    <span>FRETE GRÁTIS</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ItemsTemplate
