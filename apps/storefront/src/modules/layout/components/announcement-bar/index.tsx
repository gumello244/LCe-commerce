"use client"

import { useState, useEffect, useCallback } from "react"
import { useNavHeader } from "@modules/layout/components/nav-header"

const ANNOUNCEMENTS = [
  "Parcele em até 10x sem juros",
  "Parcela mínima R$80,00",
  "Entrega Expressa SP e Região",
  "Cadastre-se e receba 10% OFF na 1ª compra em Novidades",
]

const ChevronLeft = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="w-3.5 h-3.5 lg:w-4 lg:h-4"
  >
    <path
      fillRule="evenodd"
      d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
      clipRule="evenodd"
    />
  </svg>
)

const ChevronRight = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="w-3.5 h-3.5 lg:w-4 lg:h-4"
  >
    <path
      fillRule="evenodd"
      d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
      clipRule="evenodd"
    />
  </svg>
)

export default function AnnouncementBar() {
  const { showAnnouncement } = useNavHeader()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [fade, setFade] = useState(true)

  const goToNext = useCallback(() => {
    setFade(false)
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length)
      setFade(true)
    }, 200)
  }, [])

  const goToPrev = useCallback(() => {
    setFade(false)
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + ANNOUNCEMENTS.length) % ANNOUNCEMENTS.length)
      setFade(true)
    }, 200)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      goToNext()
    }, 6500)

    return () => clearInterval(interval)
  }, [goToNext])

  const renderText = (index: number) => {
    if (index === 3) {
      return (
        <span>
          Cadastre-se e receba <strong className="font-bold text-white">10% OFF</strong> na 1ª compra em <strong>Novidades</strong>.
        </span>
      )
    }
    return <span>{ANNOUNCEMENTS[index]}</span>
  }

  return (
    <div
      className={`
        w-full bg-black text-white text-[11px] lg:text-[12.5px] px-3 sm:px-6 flex items-center justify-between
        select-none relative z-20 overflow-hidden transition-all duration-300 ease-in-out
        ${
          showAnnouncement
            ? "max-h-10 py-1.5 opacity-100 translate-y-0 border-b border-black"
            : "max-h-0 py-0 opacity-0 -translate-y-full pointer-events-none border-b-0"
        }
      `}
    >
      {/* Botão Anterior */}
      <button
        type="button"
        onClick={goToPrev}
        className="p-1 text-white/70 hover:text-white transition-colors cursor-pointer"
        aria-label="Anúncio anterior"
      >
        <ChevronLeft />
      </button>

      {/* Conteúdo Central */}
      <div className="flex-1 flex items-center justify-center text-center px-2">
        <div className={`transition-opacity duration-300 font-sans tracking-wide leading-tight ${fade ? "opacity-100" : "opacity-0"}`}>
          {renderText(currentIndex)}
        </div>
      </div>

      {/* Botão Próximo */}
      <button
        type="button"
        onClick={goToNext}
        className="p-1 text-white/70 hover:text-white transition-colors cursor-pointer"
        aria-label="Próximo anúncio"
      >
        <ChevronRight />
      </button>
    </div>
  )
}
