import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const Hero = () => {
  return (
    <section className="relative w-full aspect-[4/3] sm:aspect-[1.6/1] md:aspect-[3168/1344] min-h-[320px] sm:min-h-[420px] md:min-h-[520px] lg:min-h-[620px] max-h-[1080px] bg-[#c3c4c8] overflow-hidden">
      <LocalizedClientLink href="/store" className="block relative w-full h-full">
        {/* Imagem do Banner principal expandido */}
        <Image
          src="/images/banner-3.png"
          alt="Últimos Lançamentos — Louise Castelatto"
          fill
          priority
          quality={100}
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
