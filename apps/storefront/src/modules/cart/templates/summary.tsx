"use client"

import { Button } from "@modules/common/components/ui"
import CartTotals from "@modules/common/components/cart-totals"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

type SummaryProps = {
  cart: HttpTypes.StoreCart
}

function getCheckoutStep(cart: HttpTypes.StoreCart) {
  if (!cart?.shipping_address?.address_1 || !cart.email) {
    return "address"
  } else if (cart?.shipping_methods?.length === 0) {
    return "delivery"
  } else {
    return "payment"
  }
}

const Summary = ({ cart }: SummaryProps) => {
  const step = getCheckoutStep(cart)

  return (
    <div className="bg-gray-50/90 border border-gray-200/80 rounded-2xl p-6 space-y-6 shadow-2xs">
      {/* Totals */}
      <CartTotals totals={cart} />

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 pt-2">
        <LocalizedClientLink
          href={"/checkout?step=" + step}
          data-testid="checkout-button"
          className="w-full"
        >
          <Button className="w-full h-12 bg-black hover:bg-gray-900 text-white font-extrabold uppercase tracking-wider text-xs rounded-lg shadow-md transition-all active:scale-[0.99]">
            FINALIZAR COMPRA
          </Button>
        </LocalizedClientLink>

        <LocalizedClientLink href="/store" className="w-full">
          <Button
            variant="secondary"
            className="w-full h-11 border border-gray-300 bg-white hover:bg-gray-50 text-gray-800 font-bold uppercase tracking-wider text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
          >
            <span>‹</span> CONTINUAR COMPRANDO
          </Button>
        </LocalizedClientLink>
      </div>

      {/* Mercado Pago Security & Payment Logos */}
      <div className="pt-4 border-t border-gray-200/60 text-center space-y-3">
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">
          PAGAMENTO SEGURO E RÁPIDO
        </span>

        {/* Payment Badges Grid */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {/* Mercado Pago Badge */}
          <div className="px-2.5 py-1 bg-sky-50 border border-sky-200 rounded text-[10px] font-extrabold text-sky-700 flex items-center gap-1">
            <svg className="w-3.5 h-3.5 fill-sky-500" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
            Mercado Pago
          </div>

          {/* Pix Badge */}
          <div className="px-2 py-1 bg-emerald-50 border border-emerald-200 rounded text-[10px] font-bold text-emerald-800">
            Pix
          </div>

          {/* Visa */}
          <div className="px-2 py-1 bg-white border border-gray-200 rounded text-[10px] font-bold text-blue-900">
            VISA
          </div>

          {/* Mastercard */}
          <div className="px-2 py-1 bg-white border border-gray-200 rounded text-[10px] font-bold text-red-600">
            Mastercard
          </div>

          {/* Elo */}
          <div className="px-2 py-1 bg-white border border-gray-200 rounded text-[10px] font-bold text-gray-900">
            Elo
          </div>

          {/* Hipercard */}
          <div className="px-2 py-1 bg-white border border-gray-200 rounded text-[10px] font-bold text-red-700">
            Hipercard
          </div>

          {/* Boleto */}
          <div className="px-2 py-1 bg-white border border-gray-200 rounded text-[10px] font-bold text-gray-700">
            Boleto
          </div>
        </div>
      </div>
    </div>
  )
}

export default Summary

