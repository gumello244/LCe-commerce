"use client"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"
import { ReactNode, useState, useRef } from "react"
import { MAIN_CATEGORIES, CategoryConfig } from "@lib/constants/nav-categories"

// ─── Ícones ──────────────────────────────────────────────────────────────────

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
  </svg>
)

const HeartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
  </svg>
)

const AccountIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
  </svg>
)

const ChevronDown = ({ open }: { open: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
    className={`w-3 h-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
  </svg>
)

// ─── Componente de link com dropdown por categoria ────────────────────────────

function CategoryDropdownNavItem({ category }: { category: CategoryConfig }) {
  const [open, setOpen] = useState(false)
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleEnter = () => {
    if (timeout.current) clearTimeout(timeout.current)
    setOpen(true)
  }
  const handleLeave = () => {
    timeout.current = setTimeout(() => setOpen(false), 120)
  }

  return (
    <div
      className="relative h-full flex items-center"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <LocalizedClientLink
        href={category.href}
        className={`
          flex items-center gap-1 h-full px-1 text-[11px] lg:text-xs font-semibold uppercase tracking-wider
          border-b-2 transition-colors duration-150
          ${open
            ? "border-brand-teal text-brand-teal"
            : "border-transparent text-gray-800 hover:text-brand-teal"
          }
        `}
      >
        {category.name}
        <ChevronDown open={open} />
      </LocalizedClientLink>

      {/* Dropdown */}
      <div
        className={`
          absolute top-full left-0 mt-0 z-50 bg-white shadow-xl border border-gray-100
          rounded-b-lg min-w-[220px] py-3
          transition-all duration-200 origin-top
          ${open ? "opacity-100 scale-y-100 pointer-events-auto" : "opacity-0 scale-y-95 pointer-events-none"}
        `}
      >
        <div className="px-4 pb-2 mb-1 border-b border-gray-100">
          <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
            {category.name}
          </span>
        </div>
        <ul className="flex flex-col">
          {category.subcategories.map((sub) => (
            <li key={sub.slug}>
              <LocalizedClientLink
                href={sub.href}
                className="block px-4 py-2 text-xs font-medium text-gray-700 hover:bg-brand-hortela hover:text-brand-teal transition-colors duration-100"
              >
                {sub.name}
              </LocalizedClientLink>
            </li>
          ))}
        </ul>
        <div className="px-4 pt-2 mt-1 border-t border-gray-100">
          <LocalizedClientLink
            href={category.href}
            className="text-xs font-semibold text-brand-teal hover:underline"
          >
            Ver tudo em {category.name} →
          </LocalizedClientLink>
        </div>
      </div>
    </div>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────

type DesktopNavProps = {
  cartSlot: ReactNode
}

export default function DesktopNav({ cartSlot }: DesktopNavProps) {
  return (
    <div className="hidden md:flex w-full h-full items-center justify-between gap-4">
      {/* ── Esquerda: Logo PNG + Navegação principal ───────── */}
      <div className="flex items-center gap-4 lg:gap-8 h-full">
        {/* Logo oficial em PNG */}
        <LocalizedClientLink
          href="/"
          className="flex-shrink-0 flex items-center"
          data-testid="nav-store-link"
        >
          <Image
            src="/logo.png"
            alt="Louise Castelatto"
            width={180}
            height={32}
            className="h-6 lg:h-7 w-auto object-contain"
            priority
          />
        </LocalizedClientLink>

        {/* Links de Navegação */}
        <nav className="flex items-center h-full gap-4 lg:gap-6">
          <LocalizedClientLink
            href="/store"
            className="text-[11px] lg:text-xs font-semibold uppercase tracking-wider text-gray-800 hover:text-brand-teal border-b-2 border-transparent hover:border-brand-teal h-full flex items-center transition-colors duration-150"
            data-testid="nav-store-link-desktop"
          >
            Novidades
          </LocalizedClientLink>

          {/* 5 Dropdowns de Categorias Destacadas */}
          {MAIN_CATEGORIES.map((category) => (
            <CategoryDropdownNavItem key={category.slug} category={category} />
          ))}

          <LocalizedClientLink
            href="/troca-e-devolucao"
            className="text-[11px] lg:text-xs font-semibold uppercase tracking-wider text-gray-800 hover:text-brand-teal border-b-2 border-transparent hover:border-brand-teal h-full flex items-center transition-colors duration-150"
          >
            Troca e Devolução
          </LocalizedClientLink>
        </nav>
      </div>

      {/* ── Direita: Campo de busca estilo Hipnoise + Ícones ─ */}
      <div className="flex items-center gap-3 lg:gap-5 shrink-0">
        {/* Campo de Busca */}
        <form
          action="/store"
          method="GET"
          className="relative flex items-center border border-gray-300 bg-white px-3 py-1.5 min-w-[160px] lg:min-w-[220px]"
        >
          <input
            type="text"
            name="q"
            placeholder="O que você procura?"
            className="w-full bg-transparent text-xs text-gray-800 placeholder-gray-400 focus:outline-none pr-6"
          />
          <button
            type="submit"
            className="absolute right-2.5 text-gray-400 hover:text-gray-700 transition-colors"
            aria-label="Pesquisar"
          >
            <SearchIcon />
          </button>
        </form>

        {/* Ícone Favoritos / Coração */}
        <LocalizedClientLink
          href="/store"
          className="text-gray-700 hover:text-brand-teal transition-colors"
          aria-label="Favoritos"
          title="Favoritos"
        >
          <HeartIcon />
        </LocalizedClientLink>

        {/* Ícone Minha Conta */}
        <LocalizedClientLink
          href="/account"
          className="text-gray-700 hover:text-brand-teal transition-colors"
          aria-label="Minha Conta"
          title="Minha Conta"
          data-testid="nav-account-link"
        >
          <AccountIcon />
        </LocalizedClientLink>

        {/* Carrinho Slot */}
        {cartSlot}
      </div>
    </div>
  )
}
