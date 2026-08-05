"use client"

import { useState, useEffect } from "react"
import { useNavHeader } from "@modules/layout/components/nav-header"

const ANNOUNCEMENTS = [
  "Parcele em até 10x sem juros",
  "Parcela mínima R$80,00",
  "Entrega Expressa SP e Região",
  "Cadastre-se e receba 10% OFF na 1ª compra em Novidades",
]

export default function AnnouncementBar() {
  const { isTransparent } = useNavHeader()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [fade, setFade] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false)
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length)
        setFade(true)
      }, 300)
    }, 6500)

    return () => clearInterval(interval)
  }, [])

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
        w-full bg-black text-white text-[11px] lg:text-[13.3px] px-4 text-center flex items-center justify-center
        overflow-hidden transition-all duration-300 ease-in-out select-none
        ${
          isTransparent
            ? "max-h-10 py-1 opacity-100 translate-y-0"
            : "max-h-0 py-0 opacity-0 -translate-y-full pointer-events-none"
        }
      `}
    >
      <div className={`transition-opacity duration-300 font-sans tracking-wide leading-tight ${fade ? "opacity-100" : "opacity-0"}`}>
        {renderText(currentIndex)}
      </div>
    </div>
  )
}
