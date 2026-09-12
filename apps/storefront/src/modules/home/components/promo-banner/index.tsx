import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type PromoBannerProps = {
  href?: string
  alt?: string
}

export default function PromoBanner({
  href = "/store",
  alt = "24 hour flash sale — 20% off sitewide | use code: 20SHOP",
}: PromoBannerProps) {
  return (
    <section className="w-full bg-black overflow-hidden select-none mb-[3px] md:mb-[4px]">
      <LocalizedClientLink
        href={href}
        className="group relative block w-full aspect-[1904/245] max-w-[2560px] mx-auto overflow-hidden transition-opacity duration-200 hover:opacity-95"
        aria-label="Acessar promoção 20% off sitewide"
      >
        <Image
          src="/images/top-promo-banner.png"
          alt={alt}
          fill
          priority
          quality={100}
          sizes="100vw"
          className="object-contain md:object-cover object-center"
        />
      </LocalizedClientLink>
    </section>
  )
}
