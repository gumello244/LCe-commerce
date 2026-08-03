import { Metadata } from "next"
import Hero from "@modules/home/components/hero"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const metadata: Metadata = {
  title: "Louise Castelatto | Elegância & Estilo",
  description:
    "E-commerce de moda e estilo com produtos exclusivos da marca Louise Castelatto.",
}

const SIZES = ["PP", "P", "M", "G", "GG", "EG"]

export default async function Home() {
  return (
    <main className="min-h-screen w-full bg-white pb-20">
      {/* Hero Banner Principal com Header Camaleão sobreposto */}
      <Hero />

      {/* Faixa: Compre por Tamanho (Inspirada no layout de e-commerce de moda) */}
      <section className="w-full bg-neutral-50/70 border-b border-gray-200/80 py-4 px-4">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-center gap-3 md:gap-6 text-xs text-gray-700">
          <span className="font-semibold tracking-wide uppercase text-gray-500 text-[11px]">
            Compre por tamanho
          </span>
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {SIZES.map((size) => (
              <LocalizedClientLink
                key={size}
                href={`/store?size=${size}`}
                className="min-w-[48px] h-9 px-3 flex items-center justify-center bg-amber-50/60 hover:bg-amber-100/80 border border-amber-200/60 text-gray-800 text-xs font-medium transition-all duration-150 shadow-2xs hover:scale-105"
              >
                {size}
              </LocalizedClientLink>
            ))}
          </div>
        </div>
      </section>

      {/* Conteúdo de demonstração para testar o scroll e efeito camaleão */}
      <section className="max-w-[1440px] mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-serif tracking-wide text-gray-900 uppercase">
            Compre por categoria
          </h2>
          <div className="w-12 h-[2px] bg-brand-teal mx-auto mt-3" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {["Vestidos", "Blusas", "Conjuntos", "Novidades"].map((cat) => (
            <LocalizedClientLink
              key={cat}
              href="/store"
              className="group relative h-64 md:h-80 bg-gray-100 rounded-lg overflow-hidden flex items-end p-6 border border-gray-200/60 shadow-xs hover:shadow-md transition-all"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
              <span className="relative z-20 text-white font-semibold text-lg uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                {cat}
              </span>
            </LocalizedClientLink>
          ))}
        </div>
      </section>
    </main>
  )
}
