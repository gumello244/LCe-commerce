import { Metadata } from "next"
import Hero from "@modules/home/components/hero"
import CategoryShowcase from "@modules/home/components/category-showcase"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const metadata: Metadata = {
  title: "Louise Castelatto | Elegância & Estilo",
  description:
    "E-commerce de moda e estilo com produtos exclusivos da marca Louise Castelatto.",
}

const SIZES = ["PP", "P", "M", "G", "GG", "EG"]

type Props = {
  params: Promise<{ countryCode: string }>
}

export default async function Home(props: Props) {
  const { countryCode } = await props.params

  return (
    <main className="min-h-screen w-full bg-white pb-20">
      {/* Hero Banner Principal com Header Camaleão sobreposto */}
      <Hero />

      {/* Mini Vitrine Editorial: Shop By Category (Vestidos) */}
      <CategoryShowcase countryCode={countryCode} />

      {/* Faixa: Compre por Tamanho */}
      <section className="w-full bg-neutral-50/70 border-b border-gray-200/80 py-5 px-4">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-center gap-3 md:gap-6 text-xs text-gray-700">
          <span className="font-semibold tracking-wide uppercase text-gray-500 text-[11px]">
            Compre por tamanho
          </span>
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {SIZES.map((size) => (
              <LocalizedClientLink
                key={size}
                href={`/store?size=${size}`}
                className="min-w-[48px] h-9 px-3 flex items-center justify-center bg-white hover:bg-neutral-100 border border-gray-300 text-gray-800 text-xs font-medium transition-all duration-150 shadow-2xs hover:scale-105 rounded-xs"
              >
                {size}
              </LocalizedClientLink>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

