import { Metadata } from "next"
import { notFound } from "next/navigation"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { getCategoryBySlug, MAIN_CATEGORIES } from "@lib/constants/nav-categories"

type Props = {
  params: Promise<{ countryCode: string; categoria: string }>
}

export async function generateStaticParams() {
  return MAIN_CATEGORIES.map((cat) => ({
    categoria: cat.slug,
  }))
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const category = getCategoryBySlug(params.categoria)

  if (!category) return {}

  return {
    title: `${category.name} | Louise Castelatto`,
    description: category.description,
  }
}

export default async function IntermediateCategoryPage(props: Props) {
  const params = await props.params
  const category = getCategoryBySlug(params.categoria)

  if (!category) {
    notFound()
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 small:px-8 py-8 min-h-screen">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[12px] text-gray-400 mb-8">
        <LocalizedClientLink href="/" className="hover:text-gray-600 transition-colors">
          Início
        </LocalizedClientLink>
        <span>/</span>
        <LocalizedClientLink href="/roupas" className="hover:text-gray-600 transition-colors">
          Roupas
        </LocalizedClientLink>
        <span>/</span>
        <span className="text-gray-800 font-medium">{category.name}</span>
      </div>

      {/* Hero / Header da Categoria */}
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <h1 className="text-3xl small:text-4xl font-bold uppercase tracking-[0.1em] text-gray-900 mb-3">
          {category.name}
        </h1>
        {category.description && (
          <p className="text-sm text-gray-500 font-normal leading-relaxed">
            {category.description}
          </p>
        )}
      </div>

      {/* Grid de Cards de Subcategorias */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {category.subcategories.map((sub) => (
          <LocalizedClientLink
            key={sub.slug}
            href={sub.href}
            className="group relative flex flex-col items-center justify-center min-h-[220px] rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-brand-teal overflow-hidden"
          >
            {/* Elemento gráfico de fundo */}
            <div className="absolute inset-0 bg-brand-teal/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Espaço reservado para futura imagem */}
            <div className="w-16 h-16 rounded-full bg-white shadow-inner flex items-center justify-center mb-4 text-brand-teal group-hover:scale-110 transition-transform duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
            </div>

            {/* Título da Subcategoria */}
            <h2 className="text-lg font-bold text-gray-800 uppercase tracking-wider group-hover:text-brand-teal transition-colors">
              {sub.name}
            </h2>
            <span className="mt-2 text-xs font-semibold text-gray-400 group-hover:text-brand-teal transition-colors flex items-center gap-1">
              Ver produtos
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </span>
          </LocalizedClientLink>
        ))}
      </div>
    </div>
  )
}
