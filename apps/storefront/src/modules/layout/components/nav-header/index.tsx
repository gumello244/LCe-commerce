"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { usePathname, useParams } from "next/navigation"

type NavHeaderContextType = {
  isTransparent: boolean
}

const NavHeaderContext = createContext<NavHeaderContextType>({ isTransparent: false })

export const useNavHeader = () => useContext(NavHeaderContext)

type NavHeaderProps = {
  children: React.ReactNode
}

export default function NavHeader({ children }: NavHeaderProps) {
  const pathname = usePathname()
  const params = useParams()
  const countryCode = (params?.countryCode as string) || "br"

  // Verifica se a página atual é a home page
  const cleanPath = pathname?.replace(new RegExp(`^/${countryCode}`), "") || ""
  const isHome = cleanPath === "" || cleanPath === "/"

  const [isScrolled, setIsScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Evita erro de Hidratação do React (SSR vs Client): no primeiro render usa o estado do servidor
  const isTransparent = isHome && (!mounted || !isScrolled)

  return (
    <NavHeaderContext.Provider value={{ isTransparent }}>
      <div
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${isTransparent
          ? "bg-transparent border-b border-transparent shadow-none"
          : "bg-white/95 backdrop-blur-md border-b border-gray-200/80 shadow-xs"
          }`}
      >
        <header className="relative w-full">
          {children}
        </header>
      </div>

      {/* Espaçador para páginas que não são a Home, garantindo que o conteúdo não fique escondido sob o header fixo */}
      {!isHome && (
        <div className="h-16 md:h-20 w-full shrink-0" aria-hidden="true" />
      )}
    </NavHeaderContext.Provider>
  )
}
