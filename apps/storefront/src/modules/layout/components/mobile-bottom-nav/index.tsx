"use client"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useState } from "react"
import MobileSideMenu from "../mobile-side-menu"

const HomeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.8}
    stroke="currentColor"
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
    />
  </svg>
)

const MenuIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.8}
    stroke="currentColor"
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
    />
  </svg>
)

const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.8}
    stroke="currentColor"
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
    />
  </svg>
)

const AccountIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.8}
    stroke="currentColor"
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
    />
  </svg>
)

const CartIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.8}
    stroke="currentColor"
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z"
    />
  </svg>
)

export default function MobileBottomNav() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      {/* Barra de navegação inferior — só aparece no mobile */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="flex items-center justify-around h-16 px-2">
          {/* Início */}
          <LocalizedClientLink
            href="/"
            className="flex flex-col items-center gap-0.5 text-gray-500 hover:text-brand-teal transition-colors"
            data-testid="mobile-nav-home"
          >
            <HomeIcon />
            <span className="text-[10px] font-medium">Início</span>
          </LocalizedClientLink>

          {/* Menu */}
          <button
            onClick={() => setMenuOpen(true)}
            className="flex flex-col items-center gap-0.5 text-gray-500 hover:text-brand-teal transition-colors"
            data-testid="mobile-nav-menu"
            aria-label="Abrir menu"
          >
            <MenuIcon />
            <span className="text-[10px] font-medium">Menu</span>
          </button>

          {/* Busca */}
          <LocalizedClientLink
            href="/search"
            className="flex flex-col items-center gap-0.5 text-gray-500 hover:text-brand-teal transition-colors"
            data-testid="mobile-nav-search"
          >
            <SearchIcon />
            <span className="text-[10px] font-medium">Buscar</span>
          </LocalizedClientLink>

          {/* Conta */}
          <LocalizedClientLink
            href="/account"
            className="flex flex-col items-center gap-0.5 text-gray-500 hover:text-brand-teal transition-colors"
            data-testid="mobile-nav-account"
          >
            <AccountIcon />
            <span className="text-[10px] font-medium">Conta</span>
          </LocalizedClientLink>

          {/* Carrinho */}
          <LocalizedClientLink
            href="/cart"
            className="flex flex-col items-center gap-0.5 text-gray-500 hover:text-brand-teal transition-colors"
            data-testid="mobile-nav-cart"
          >
            <CartIcon />
            <span className="text-[10px] font-medium">Carrinho</span>
          </LocalizedClientLink>
        </div>
      </nav>

      {/* Menu lateral mobile */}
      <MobileSideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}
