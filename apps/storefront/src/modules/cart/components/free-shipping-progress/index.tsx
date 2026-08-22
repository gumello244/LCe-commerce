"use client"

import { HttpTypes } from "@medusajs/types"
import React from "react"

type FreeShippingProgressProps = {
  cart: HttpTypes.StoreCart
}

const FREE_SHIPPING_THRESHOLD = 200 // R$ 200,00

export default function FreeShippingProgress({ cart }: FreeShippingProgressProps) {
  // Subtotal in BRL
  const subtotal = (cart.subtotal || 0)

  const progressPercent = Math.min(100, Math.max(0, (subtotal / FREE_SHIPPING_THRESHOLD) * 100))
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)
  const isFree = subtotal >= FREE_SHIPPING_THRESHOLD

  const formattedRemaining = remaining.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center gap-2 mb-8 text-center animate-fade-in">
      <p className="text-sm font-semibold text-gray-800 tracking-tight">
        {isFree ? (
          <span className="text-emerald-700 font-bold flex items-center justify-center gap-1.5">
            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Parabéns! Você ganhou FRETE GRÁTIS!
          </span>
        ) : (
          <>
            Gaste mais <span className="font-bold text-gray-900">R$ {formattedRemaining}</span> e ganhe frete grátis!
          </>
        )}
      </p>

      {/* Progress Bar Track */}
      <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden relative shadow-inner">
        <div
          className={`h-full transition-all duration-500 rounded-full ${
            isFree ? "bg-emerald-500" : "bg-brand-teal"
          }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  )
}
