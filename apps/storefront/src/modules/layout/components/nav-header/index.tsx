"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { usePathname, useParams } from "next/navigation"

type NavHeaderContextType = {
  isTransparent: boolean
  showAnnouncement: boolean
}

const NavHeaderContext = createContext<NavHeaderContextType>({
  isTransparent: false,
  showAnnouncement: true,
})

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
      if (window.scrollY > 50) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // A barrinha de anúncios só aparece quando o usuário está no topo da home
  const showAnnouncement = isHome && (!mounted || !isScrolled)

  return (
    <NavHeaderContext.Provider value={{ isTransparent: false, showAnnouncement }}>
      <div className="sticky top-0 inset-x-0 z-50 bg-white border-b border-gray-200 transition-all duration-300">
        <header className="relative w-full font-[family-name:var(--font-jhc-sineas)]">
          {children}
        </header>
      </div>
    </NavHeaderContext.Provider>
  )
}
