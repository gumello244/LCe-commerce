"use client"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"
import { ReactNode } from "react"

export default function MobileNav({ cartSlot }: { cartSlot: ReactNode }) {
  return (
    <nav className="md:hidden flex items-center justify-between w-full h-14 px-4 bg-white text-gray-900 border-b border-gray-200">
      <LocalizedClientLink
        href="/"
        className="flex items-center"
        data-testid="nav-store-link-mobile"
      >
        <Image
          src="/logo.png"
          alt="Louise Castelatto"
          width={1024}
          height={118}
          className="h-6 w-auto object-contain"
          priority
        />
      </LocalizedClientLink>
      <div className="flex items-center gap-3">
        <LocalizedClientLink
          href="/store"
          className="text-[11px] uppercase tracking-wider font-medium text-gray-700 hover:text-black px-2.5 py-1 border border-gray-200 rounded-[2px]"
        >
          Explorar
        </LocalizedClientLink>
        {cartSlot}
      </div>
    </nav>
  )
}
