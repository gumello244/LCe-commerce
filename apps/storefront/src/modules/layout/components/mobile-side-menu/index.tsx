"use client"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useState } from "react"
import { MAIN_CATEGORIES, CategoryConfig } from "@lib/constants/nav-categories"

const ChevronLeftIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
  </svg>
)

const ChevronRightIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
  </svg>
)

const XIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className="w-6 h-6"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
  </svg>
)

type MobileSideMenuProps = {
  open: boolean
  onClose: () => void
}

export default function MobileSideMenu({ open, onClose }: MobileSideMenuProps) {
  const [selectedCategory, setSelectedCategory] = useState<CategoryConfig | null>(null)

  const handleClose = () => {
    onClose()
    setTimeout(() => setSelectedCategory(null), 300)
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`
          md:hidden fixed inset-0 z-[60] bg-black/40 transition-opacity duration-300
          ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Painel lateral */}
      <div
        className={`
          md:hidden fixed top-0 left-0 bottom-0 z-[70] w-[85vw] max-w-sm bg-white
          flex flex-col shadow-2xl
          transform transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navegação"
      >
        {/* Cabeçalho do menu */}
        <div className="flex items-center justify-between px-6 pt-8 pb-6 border-b border-gray-100">
          {selectedCategory ? (
            <button
              onClick={() => setSelectedCategory(null)}
              className="flex items-center gap-1 text-brand-teal font-medium text-sm"
              aria-label="Voltar"
            >
              <ChevronLeftIcon />
              Voltar
            </button>
          ) : (
            <span className="text-lg font-semibold text-gray-900 tracking-wide">Menu</span>
          )}
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-700 transition-colors"
            aria-label="Fechar menu"
          >
            <XIcon />
          </button>
        </div>

        {/* Conteúdo: Nível 1 - Menu Principal */}
        <div
          className={`
            flex flex-col flex-1 overflow-y-auto
            transition-transform duration-300 ease-in-out
            ${!selectedCategory ? "translate-x-0" : "-translate-x-full absolute inset-0 pointer-events-none"}
          `}
        >
          {!selectedCategory && (
            <ul className="flex flex-col px-6 py-4 gap-1">
              <li>
                <LocalizedClientLink
                  href="/store"
                  onClick={handleClose}
                  className="flex items-center justify-between w-full py-3.5 text-left text-gray-800 text-sm font-semibold uppercase tracking-wider border-b border-gray-100 hover:text-brand-teal transition-colors"
                >
                  Novidades
                </LocalizedClientLink>
              </li>

              {/* Categorias inteiras com subcategorias */}
              {MAIN_CATEGORIES.map((cat) => (
                <li key={cat.slug}>
                  <button
                    onClick={() => setSelectedCategory(cat)}
                    className="flex items-center justify-between w-full py-3.5 text-left text-gray-800 text-sm font-medium border-b border-gray-100 hover:text-brand-teal transition-colors"
                  >
                    {cat.name}
                    <ChevronRightIcon />
                  </button>
                </li>
              ))}

              {/* Links diretos */}
              <li>
                <LocalizedClientLink
                  href="/troca-e-devolucao"
                  onClick={handleClose}
                  className="flex items-center justify-between w-full py-3.5 text-left text-gray-800 text-sm font-medium border-b border-gray-100 hover:text-brand-teal transition-colors"
                >
                  Troca e Devolução
                </LocalizedClientLink>
              </li>
            </ul>
          )}
        </div>

        {/* Conteúdo: Nível 2 - Subcategorias */}
        <div
          className={`
            flex flex-col flex-1 overflow-y-auto
            transition-transform duration-300 ease-in-out
            ${selectedCategory ? "translate-x-0" : "translate-x-full absolute inset-0 pointer-events-none"}
          `}
        >
          {selectedCategory && (
            <>
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <span className="text-xs uppercase tracking-widest text-gray-500 font-bold">
                  {selectedCategory.name}
                </span>
                <LocalizedClientLink
                  href={selectedCategory.href}
                  onClick={handleClose}
                  className="text-xs font-semibold text-brand-teal underline"
                >
                  Ver tudo →
                </LocalizedClientLink>
              </div>

              <ul className="flex flex-col px-6 gap-1 py-2">
                {selectedCategory.subcategories.map((sub) => (
                  <li key={sub.slug}>
                    <LocalizedClientLink
                      href={sub.href}
                      onClick={handleClose}
                      className="flex items-center justify-between w-full py-3 text-gray-700 text-sm font-medium border-b border-gray-100 hover:text-brand-teal transition-colors"
                    >
                      {sub.name}
                    </LocalizedClientLink>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        {/* Rodapé do menu */}
        <div className="px-6 py-6 border-t border-gray-100">
          <p className="text-xs text-gray-400 text-center">
            © {new Date().getFullYear()} Louise Castelatto
          </p>
        </div>
      </div>
    </>
  )
}
