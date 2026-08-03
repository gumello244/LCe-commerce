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

const ChevronDown = ({ open, isTransparent }: { open: boolean; isTransparent: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
    className={`w-3.5 h-3.5 transition-transform duration-200 ${
      open ? "rotate-180 text-brand-teal" : isTransparent ? "text-white" : "text-gray-800"
    }`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
  </svg>
)

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
    ? open ? "text-brand-teal font-semibold" : "text-white hover:text-white/80"
    : open ? "text-brand-teal font-semibold" : "text-gray-900 hover:text-brand-teal"

  return (
    <div
      className="relative h-full flex items-center"
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

      {/* Dropdown Menu */}
      <div
        className={`
          absolute top-full left-0 mt-0 z-50 bg-white shadow-xl border border-gray-100
          rounded-b-xl min-w-[220px] py-3
          transition-all duration-200 origin-top
          ${open ? "opacity-100 scale-y-100 pointer-events-auto" : "opacity-0 scale-y-95 pointer-events-none"}
        `}
      >
        <div className="px-4 pb-2 mb-1 border-b border-gray-100">
          <span className="text-[11px] font-bold uppercase tracking-widest text-brand-teal">
            {category.name}
          </span>
        </div>
        <ul className="flex flex-col">
          {category.subcategories.map((sub) => (
            <li key={sub.slug}>
              <LocalizedClientLink
                href={sub.href}
                className="block px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-brand-teal transition-colors duration-100"
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
  const hoverColor = isTransparent ? "hover:text-white/80" : "hover:text-brand-teal"

  return (
    <div className="flex flex-col w-full bg-transparent">
      {/* ── SINGLE ROW HEADER: Categories (Left) | Logo (Center) | Actions (Right) ── */}
      <div className="w-full px-6 lg:px-12 h-20 flex items-center justify-between relative">
        
        {/* LEFT: Category Navigation Bar */}
        <div className={`flex items-center gap-3 lg:gap-6 text-sm lg:text-[15px] font-medium z-10 max-w-[45%] ${textColor}`}>
          {/* Main Categories Dropdowns */}
          {MAIN_CATEGORIES.map((category) => (
            <CategoryDropdownNavItem key={category.slug} category={category} />
          ))}
        </div>

        {/* CENTER: Brand Logo */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center z-10">
          <LocalizedClientLink
            href="/"
            className="flex items-center"
            data-testid="nav-store-link"
          >
            <Image
              src="/logo.svg"
              alt="Louise Castelatto"
              width={240}
              height={38}
              className="h-8 lg:h-9 w-auto object-contain"
              priority
            />
          </LocalizedClientLink>
        </div>

        {/* RIGHT: Search + Account + Favorites + Cart */}
        <div className={`flex items-center gap-5 ml-auto z-10 ${textColor}`}>
          
          {/* Search Toggle Button / Expandable Bar */}
          <div className="relative">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className={`p-1 ${hoverColor} transition-colors flex items-center`}
              title="Buscar"
              type="button"
            >
              <SearchIcon />
            </button>

            {/* Expandable Search Input */}
            {searchOpen && (
              <form
                onSubmit={handleSearch}
                className="absolute right-0 top-full mt-2 w-72 bg-white/95 backdrop-blur-md border border-gray-200 rounded-full shadow-lg p-1.5 flex items-center z-50 animate-in fade-in slide-in-from-top-2 duration-200 text-gray-900"
              >
                <input
                  type="text"
                  name="q"
                  placeholder="Buscar produtos..."
                  autoFocus
                  className="w-full bg-transparent text-xs text-gray-800 placeholder-gray-400 focus:outline-none pl-3 pr-2"
                />
                <button
                  type="submit"
                  className="p-1.5 bg-brand-teal text-white rounded-full hover:opacity-90 transition-opacity"
                >
                  <SearchIcon />
                </button>
              </form>
            )}
          </div>

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
