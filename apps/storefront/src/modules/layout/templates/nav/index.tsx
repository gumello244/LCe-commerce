import { Suspense } from "react"
import Image from "next/image"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import DesktopNav from "@modules/layout/components/desktop-nav"

export default async function Nav() {
  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      <header className="relative h-16 mx-auto border-b duration-200 bg-white border-ui-border-base">
        {/* ── Desktop (md+): componente completo com logo + nav + busca + ações ── */}
        <div className="hidden md:flex content-container h-full px-6">
          <DesktopNav
            cartSlot={
              <Suspense
                fallback={
                  <LocalizedClientLink
                    className="text-gray-500 hover:text-brand-teal transition-colors"
                    href="/cart"
                    data-testid="nav-cart-link"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z" />
                    </svg>
                  </LocalizedClientLink>
                }
              >
                <CartButton />
              </Suspense>
            }
          />
        </div>

        {/* ── Mobile (< md): logo PNG perfeitamente centralizado e limpo ── */}
        <nav className="md:hidden content-container flex items-center justify-center w-full h-full px-4">
          <LocalizedClientLink
            href="/"
            className="flex items-center justify-center"
            data-testid="nav-store-link-mobile"
          >
            <Image
              src="/logo.png"
              alt="Louise Castelatto"
              width={320}
              height={52}
              className="h-[52px] w-auto object-contain"
              priority
            />
          </LocalizedClientLink>
        </nav>
      </header>
    </div>
  )
}
