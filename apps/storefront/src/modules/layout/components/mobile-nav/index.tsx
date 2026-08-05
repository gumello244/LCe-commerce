"use client"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"
import { useNavHeader } from "@modules/layout/components/nav-header"
import { ReactNode } from "react"

export default function MobileNav({ cartSlot }: { cartSlot: ReactNode }) {
  const { isTransparent } = useNavHeader()
  const textColor = isTransparent ? "text-white" : "text-gray-900"

  return (
    <nav className={`md:hidden content-container flex items-center justify-between w-full h-16 px-4 ${textColor}`}>
      <LocalizedClientLink
        href="/"
        className="flex items-center"
        data-testid="nav-store-link-mobile"
      >
        <Image
          src={isTransparent ? "/logo-white.png" : "/logo.png"}
          alt="Louise Castelatto"
          width={360}
          height={30}
          className="h-7 w-auto object-contain transition-all duration-300"
          priority
        />
      </LocalizedClientLink>
      <div className="flex items-center gap-3">
        {cartSlot}
      </div>
    </nav>
  )
}
