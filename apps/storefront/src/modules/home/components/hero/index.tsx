import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const Hero = () => {
  return (
    <section className="relative w-full aspect-[16/9] sm:aspect-[2/1] md:aspect-[2.68/1] min-h-[380px] max-h-[920px] bg-[#c3c4c8] overflow-hidden">
      <LocalizedClientLink href="/store" className="block relative w-full h-full">
        {/* Imagem do Banner principal em alta fidelidade (2.17MB PNG) */}
        <Image
          src="/images/hero-banner.png"
          alt="Últimos Lançamentos — Louise Castelatto"
          fill
          priority
          unoptimized
          sizes="100vw"
          className="object-cover object-center"
        />

        {/* Overlay sutil de contraste para o header camaleão */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent opacity-70 pointer-events-none" />
      </LocalizedClientLink>
    </section>
  )
}

export default Hero
