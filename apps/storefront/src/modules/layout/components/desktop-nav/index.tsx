"use client"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useParams, usePathname, useRouter } from "next/navigation"
import { ReactNode, useState, useRef } from "react"
import { MAIN_CATEGORIES, CategoryConfig } from "@lib/constants/nav-categories"
import { clx } from "@modules/common/components/ui"

const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-4 h-4"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
    />
  </svg>
)

const UserIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.3}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
    />
  </svg>
)

const HeartIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.3}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
    />
  </svg>
)

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
      className="relative h-full flex items-center group"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <LocalizedClientLink
        href={category.href}
        className={clx(
          "flex items-center h-full text-xs lg:text-[13px] font-normal tracking-wide whitespace-nowrap transition-colors duration-150 text-gray-700 hover:text-black",
          open && "text-black font-medium"
        )}
      >
        {category.name}
      </LocalizedClientLink>

      {/* Topdown Dropdown Menu */}
      <div
        className={clx(
          "absolute top-full left-0 mt-0 z-50 rounded-b-md min-w-[210px] py-2.5 transition-all duration-200 origin-top bg-white border border-gray-200 shadow-xl text-gray-900",
          open
            ? "opacity-100 scale-y-100 pointer-events-auto"
            : "opacity-0 scale-y-95 pointer-events-none"
        )}
      >
        <div className="px-4 pb-2 mb-1 border-b border-gray-100">
          <span className="text-[10px] font-bold uppercase tracking-widest text-brand-primary">
            {category.name}
          </span>
        </div>
        <ul className="flex flex-col">
          {category.subcategories.map((sub) => (
            <li key={sub.slug}>
              <LocalizedClientLink
                href={sub.href}
                className="block px-4 py-1.5 text-xs text-gray-600 hover:bg-neutral-50 hover:text-black transition-colors"
              >
                {sub.name}
              </LocalizedClientLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

type DesktopNavProps = {
  cartSlot: ReactNode
}

export default function DesktopNav({ cartSlot }: DesktopNavProps) {
  const router = useRouter()
  const pathname = usePathname()
  const params = useParams()
  const countryCode = (params?.countryCode as string) || "br"

  const cleanPath = pathname?.replace(new RegExp(`^/${countryCode}`), "") || ""
  const isHome = cleanPath === "" || cleanPath === "/"
  const isStore = cleanPath.startsWith("/store")

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const query = (formData.get("q") as string)?.trim()
    if (query) {
      router.push(`/${countryCode}/search?q=${encodeURIComponent(query)}`)
    }
  }

  return (
    <div className="flex flex-col w-full bg-white select-none">
      {/* ── LINHA SUPERIOR: ABAS DE MARCA (ESQUERDA) & BUSCA + AÇÕES (DIREITA) ── */}
      <div className="w-full px-4 lg:px-8 pt-3 flex items-end justify-between border-b border-gray-200">
        {/* ESQUERDA: Abas no estilo Anthropologie */}
        <div className="flex items-end">
          {/* Aba 1: LOUISE CASTELATTO (Ativa na Home) */}
          <LocalizedClientLink
            href="/"
            className={clx(
              "h-11 lg:h-12 px-6 lg:px-8 flex items-center justify-center transition-all text-xs lg:text-[13.5px] uppercase font-sans tracking-[0.2em]",
              isHome
                ? "border-t-2 border-t-black border-x border-gray-200 border-b-white bg-white text-black font-semibold relative z-10 -mb-[1px]"
                : "border-t-2 border-t-transparent border-x border-gray-200 border-b-gray-200 bg-neutral-50/70 text-gray-500 hover:text-black hover:bg-neutral-100/60"
            )}
            title="Louise Castelatto Home"
          >
            LOUISE CASTELATTO
          </LocalizedClientLink>

          {/* Aba 2: Explorar (Leva para /store) */}
          <LocalizedClientLink
            href="/store"
            className={clx(
              "h-11 lg:h-12 px-6 lg:px-8 flex items-center justify-center transition-all text-xs lg:text-[13px] uppercase font-sans tracking-[0.16em] border-l-0",
              isStore
                ? "border-t-2 border-t-black border-x border-gray-200 border-b-white bg-white text-black font-semibold relative z-10 -mb-[1px]"
                : "border-t-2 border-t-transparent border-r border-gray-200 border-b-gray-200 bg-neutral-50/70 text-gray-500 hover:text-black hover:bg-neutral-100/60"
            )}
            title="Explorar Produtos"
          >
            Explorar
          </LocalizedClientLink>
        </div>

        {/* DIREITA: Campo de Busca Retangular & Ícones de Ação */}
        <div className="flex items-center gap-4 lg:gap-5 pb-2.5">
          {/* Caixa de Busca com estilo Anthropologie */}
          <form onSubmit={handleSearch} className="relative flex items-center w-60 lg:w-72">
            <input
              type="text"
              name="q"
              placeholder="O que você está procurando?"
              className="w-full h-9 pl-3.5 pr-9 border border-gray-300 focus:border-black rounded-[2px] text-xs lg:text-[12.5px] text-gray-900 placeholder:text-gray-400 placeholder:font-light outline-none transition-colors"
            />
            <button
              type="submit"
              className="absolute right-2.5 p-1 text-gray-400 hover:text-black transition-colors cursor-pointer"
              title="Buscar"
            >
              <SearchIcon />
            </button>
          </form>

          {/* Ícone Minha Conta */}
          <LocalizedClientLink
            href="/account"
            className="p-1 text-gray-700 hover:text-black transition-colors flex items-center"
            title="Minha Conta"
          >
            <UserIcon />
          </LocalizedClientLink>

          {/* Ícone Favoritos */}
          <LocalizedClientLink
            href="/store"
            className="p-1 text-gray-700 hover:text-black transition-colors flex items-center"
            title="Favoritos"
          >
            <HeartIcon />
          </LocalizedClientLink>

          {/* Ícone Sacola / Carrinho */}
          <div className="text-gray-700 hover:text-black transition-colors flex items-center">
            {cartSlot}
          </div>
        </div>
      </div>

      {/* ── LINHA INFERIOR: BARRA DE CATEGORIAS DE NAVEGAÇÃO ── */}
      <div className="w-full px-4 lg:px-8 flex items-center justify-center gap-6 lg:gap-8 h-10 border-b border-gray-200 bg-white">
        {/* Novidades */}
        <LocalizedClientLink
          href="/store?sortBy=created_at"
          className="text-xs lg:text-[13px] font-normal tracking-wide text-gray-700 hover:text-black transition-colors whitespace-nowrap"
        >
          Novidades
        </LocalizedClientLink>

        {/* Categorias Principais com Submenus Dropdown */}
        {MAIN_CATEGORIES.map((category) => (
          <CategoryDropdownNavItem key={category.slug} category={category} />
        ))}

        {/* Ofertas */}
        <LocalizedClientLink
          href="/store"
          className="text-xs lg:text-[13px] font-normal tracking-wide text-gray-700 hover:text-black transition-colors whitespace-nowrap"
        >
          Ofertas
        </LocalizedClientLink>
      </div>
    </div>
  )
}
