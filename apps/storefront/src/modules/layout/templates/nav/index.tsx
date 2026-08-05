import { Suspense } from "react"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import DesktopNav from "@modules/layout/components/desktop-nav"
import MobileNav from "@modules/layout/components/mobile-nav"
import NavHeader from "@modules/layout/components/nav-header"

import AnnouncementBar from "@modules/layout/components/announcement-bar"

export default async function Nav() {
  return (
    <NavHeader>
      {/* ── Faixa de Anúncios no Topo (Modo Camaleão) ── */}
      <AnnouncementBar />

      {/* ── Desktop (md+): Header Mamô ── */}
      <div className="hidden md:block w-full">
        <DesktopNav
          cartSlot={
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="hover:opacity-80 transition-opacity flex items-center gap-1.5 text-xs font-semibold"
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z" />
                  </svg>
                  <span>Carrinho</span>
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          }
        />
      </div>

      {/* ── Mobile (< md): Header Responsivo com Troca Dinâmica da Logo ── */}
      <MobileNav
        cartSlot={
          <Suspense fallback={null}>
            <CartButton />
          </Suspense>
        }
      />
    </NavHeader>
  )
}
