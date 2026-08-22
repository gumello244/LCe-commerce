import ItemsTemplate from "./items"
import Summary from "./summary"
import EmptyCartMessage from "../components/empty-cart-message"
import FreeShippingProgress from "../components/free-shipping-progress"
import { HttpTypes } from "@medusajs/types"

const CartTemplate = ({
  cart,
  customer: _customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) => {
  return (
    <div className="py-8 md:py-12">
      <div className="content-container" data-testid="cart-container">
        {/* ── Title ─────────────────────────────────────────────────── */}
        <h1 className="text-2xl md:text-3xl font-extrabold text-center text-gray-900 mb-4 tracking-tight uppercase">
          Carrinho
        </h1>

        {cart?.items?.length ? (
          <>
            {/* ── Gamified Free Shipping Progress Bar ───────────────── */}
            <FreeShippingProgress cart={cart} />

            {/* ── Main Cart Grid (2 Colunas Fluidas) ───────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
              {/* Left: Items Table & Shipping Calculator (8 cols) */}
              <div className="lg:col-span-8 w-full">
                <ItemsTemplate cart={cart} />
              </div>

              {/* Right: Summary Sidebar & Mercado Pago Badges (4 cols) */}
              <div className="lg:col-span-4 w-full lg:sticky lg:top-28">
                {cart && cart.region && (
                  <Summary cart={cart} />
                )}
              </div>
            </div>
          </>
        ) : (
          <div>
            <EmptyCartMessage />
          </div>
        )}
      </div>
    </div>
  )
}

export default CartTemplate

