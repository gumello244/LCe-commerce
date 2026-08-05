"use client"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { ReactNode, useState, useRef } from "react"
import { MAIN_CATEGORIES, CategoryConfig } from "@lib/constants/nav-categories"
import { useNavHeader } from "@modules/layout/components/nav-header"

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
  </svg>
)

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
  </svg>
)

const HeartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
  </svg>
)

const ChevronDown = ({ open, isTransparent }: { open: boolean; isTransparent: boolean }) => {
  const colorClass = open
    ? isTransparent ? "rotate-180 text-pink-300" : "rotate-180 text-brand-teal"
    : isTransparent ? "text-white/80 group-hover:text-pink-200" : "text-gray-800 group-hover:text-brand-teal"

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={`w-3.5 h-3.5 transition-transform duration-200 ${colorClass}`}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
  )
}

function CategoryDropdownNavItem({ category }: { category: CategoryConfig }) {
  const { isTransparent } = useNavHeader()
  const [open, setOpen] = useState(false)
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleEnter = () => {
    if (timeout.current) clearTimeout(timeout.current)
    setOpen(true)
  }
  const handleLeave = () => {
    timeout.current = setTimeout(() => setOpen(false), 120)
  }

  const textColorClass = isTransparent
    ? open ? "text-pink-300 font-semibold" : "text-white hover:text-pink-200"
    : open ? "text-brand-teal font-semibold" : "text-gray-900 hover:text-brand-teal"

  return (
    <div
      className="relative h-full flex items-center group"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <LocalizedClientLink
        href={category.href}
        className={`
          flex items-center gap-1.5 h-full px-1 py-3 text-sm lg:text-[15px] font-medium tracking-normal
          transition-colors duration-150
          ${textColorClass}
        `}
      >
        {category.name}
        <ChevronDown open={open} isTransparent={isTransparent} />
      </LocalizedClientLink>

      {/* Topdown Dropdown Menu — Integrado ao Modo Camaleão */}
      <div
        className={`
          absolute top-full left-0 mt-0 z-50 rounded-b-xl min-w-[220px] py-3
          transition-all duration-200 origin-top
          ${open ? "opacity-100 scale-y-100 pointer-events-auto" : "opacity-0 scale-y-95 pointer-events-none"}
          ${isTransparent
            ? "bg-slate-950/85 backdrop-blur-xl border border-white/15 shadow-2xl text-white"
            : "bg-white/95 backdrop-blur-md border border-gray-100 shadow-xl text-gray-900"
          }
        `}
      >
        <div className={`px-4 pb-2 mb-1 border-b ${isTransparent ? "border-white/10" : "border-gray-100"}`}>
          <span className={`text-[11px] font-bold uppercase tracking-widest ${isTransparent ? "text-pink-300" : "text-brand-teal"}`}>
            {category.name}
          </span>
        </div>
        <ul className="flex flex-col">
          {category.subcategories.map((sub) => (
            <li key={sub.slug}>
              <LocalizedClientLink
                href={sub.href}
                className={`
                  block px-4 py-2 text-xs font-medium transition-colors duration-100
                  ${isTransparent
                    ? "text-gray-200 hover:bg-white/10 hover:text-pink-200"
                    : "text-gray-700 hover:bg-gray-50 hover:text-brand-teal"
                  }
                `}
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
  const { isTransparent } = useNavHeader()
  const router = useRouter()
  const params = useParams()
  const countryCode = (params?.countryCode as string) || "br"

  const [searchOpen, setSearchOpen] = useState(false)

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const query = (formData.get("q") as string)?.trim()
    if (query) {
      router.push(`/${countryCode}/search?q=${encodeURIComponent(query)}`)
      setSearchOpen(false)
    }
  }

  const textColor = isTransparent ? "text-white" : "text-gray-900"
  const hoverColor = isTransparent ? "hover:text-pink-200" : "hover:text-brand-teal"

  return (
    <div className="flex flex-col w-full bg-transparent">
      {/* ── HEADER LAYOUT IGUAL À REFERÊNCIA MAMÔ: Categorias (Esquerda) | Logo (Centro) | Ícones (Direita) ── */}
      <div className="w-full px-6 lg:px-12 h-16 flex items-center justify-between relative">

        {/* LEFT: Category Navigation Bar */}
        <div className={`flex items-center gap-3 lg:gap-6 text-sm lg:text-[15px] font-medium z-10 max-w-[45%] ${textColor}`}>
          {MAIN_CATEGORIES.map((category) => (
            <CategoryDropdownNavItem key={category.slug} category={category} />
          ))}
        </div>

        {/* CENTER: Brand Logo (Centralizada no Meio - Alterna para Branco no Modo Camaleão) */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center z-10">
          <LocalizedClientLink
            href="/"
            className="flex items-center"
            data-testid="nav-store-link"
          >
            <Image
              src={isTransparent ? "/logo-white.png" : "/logo.png"}
              alt="Louise Castelatto"
              width={360}
              height={30}
              className="h-6 lg:h-7 w-auto object-contain transition-all duration-300"
              priority
            />
          </LocalizedClientLink>
        </div>

        {/* RIGHT: Search Icon + Account + Favorites + Cart */}
        <div className={`flex items-center gap-4 lg:gap-5 ml-auto z-10 ${textColor}`}>

          {/* Visible Search Bar Input */}
          <form
            onSubmit={handleSearch}
            className={`
              flex items-center w-36 lg:w-52 px-3 py-1.5 rounded-full border transition-all duration-200 text-xs
              ${
                isTransparent
                  ? "bg-slate-950/40 border-white/30 text-white placeholder-white/70 focus-within:border-pink-300 focus-within:bg-slate-950/70"
                  : "bg-gray-100/90 border-gray-200 text-gray-900 placeholder-gray-400 focus-within:border-brand-teal focus-within:bg-white shadow-xs"
              }
            `}
          >
            <input
              type="text"
              name="q"
              placeholder="Buscar produtos..."
              className={`w-full bg-transparent focus:outline-none pr-1 text-xs ${
                isTransparent ? "placeholder-white/70 text-white" : "placeholder-gray-400 text-gray-900"
              }`}
            />
            <button type="submit" className={`p-0.5 ${hoverColor} transition-colors shrink-0`} title="Buscar">
              <SearchIcon />
            </button>
          </form>

          {/* Account Icon */}
          <LocalizedClientLink
            href="/account"
            className={`p-1 ${hoverColor} transition-colors flex items-center`}
            title="Minha Conta"
          >
            <UserIcon />
          </LocalizedClientLink>

          {/* Favorites Icon */}
          <LocalizedClientLink
            href="/store"
            className={`p-1 ${hoverColor} transition-colors flex items-center`}
            title="Favoritos"
          >
            <HeartIcon />
          </LocalizedClientLink>

          {/* Cart Icon */}
          <div className={`p-1 ${hoverColor} transition-colors flex items-center`}>
            {cartSlot}
          </div>
        </div>
      </div>
    </div>
  )
}
