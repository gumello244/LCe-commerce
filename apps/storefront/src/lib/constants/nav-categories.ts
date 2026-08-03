export type SubcategoryConfig = {
  name: string
  slug: string
  href: string
  allowedJeansColorsOnly?: boolean
}

export type CategoryConfig = {
  name: string
  slug: string
  href: string
  description?: string
  subcategories: SubcategoryConfig[]
}

export const MAIN_CATEGORIES: CategoryConfig[] = [
  {
    name: "Blusas",
    slug: "blusas",
    href: "/roupas/blusas",
    description: "Confira nossa seleção de blusas, croppeds, bodys, tops e blusas manga longa.",
    subcategories: [
      { name: "Blusinhas", slug: "blusinhas", href: "/roupas/blusas/blusinhas" },
      { name: "Cropped", slug: "cropped", href: "/roupas/blusas/cropped" },
      { name: "Body", slug: "body", href: "/roupas/blusas/body" },
      { name: "Top", slug: "top", href: "/roupas/blusas/top" },
      { name: "Blusa Manga Longa", slug: "blusa-manga-longa", href: "/roupas/blusas/blusa-manga-longa" },
    ],
  },
  {
    name: "Vestidos",
    slug: "vestidos",
    href: "/roupas/vestidos",
    description: "Vestidos elegantes para todas as ocasiões: longos, curtos, midi, justos e soltos.",
    subcategories: [
      { name: "Longo", slug: "longo", href: "/roupas/vestidos/longo" },
      { name: "Curto", slug: "curto", href: "/roupas/vestidos/curto" },
      { name: "Midi", slug: "midi", href: "/roupas/vestidos/midi" },
      { name: "Justo", slug: "justo", href: "/roupas/vestidos/justo" },
      { name: "Solto", slug: "solto", href: "/roupas/vestidos/solto" },
    ],
  },
  {
    name: "Conjuntos",
    slug: "conjuntos",
    href: "/roupas/conjuntos",
    description: "Conjuntos femininos sofisticados para todos os momentos: noite/festa e casual.",
    subcategories: [
      { name: "Noite/Festa", slug: "noite-festa", href: "/roupas/conjuntos/noite-festa" },
      { name: "Casual", slug: "casual", href: "/roupas/conjuntos/casual" },
    ],
  },
  {
    name: "Calças",
    slug: "calcas",
    href: "/roupas/calcas",
    description: "Modelagens incríveis: flare, cargo, legging, skinny, wide leg, cintura alta e calça moletom.",
    subcategories: [
      { name: "Flare", slug: "flare", href: "/roupas/calcas/flare" },
      { name: "Cargo", slug: "cargo", href: "/roupas/calcas/cargo" },
      { name: "Legging", slug: "legging", href: "/roupas/calcas/legging" },
      { name: "Skinny", slug: "skinny", href: "/roupas/calcas/skinny" },
      { name: "Wide Leg", slug: "wide-leg", href: "/roupas/calcas/wide-leg" },
      { name: "Cintura Alta", slug: "cintura-alta", href: "/roupas/calcas/cintura-alta" },
      { name: "Calça Moletom", slug: "calca-moletom", href: "/roupas/calcas/calca-moletom" },
    ],
  },
  {
    name: "Shorts e Saias",
    slug: "shorts-e-saias",
    href: "/roupas/shorts-e-saias",
    description: "Encontre saias curtas, midi e jeans, além de shorts jeans, moletom, courinho e lycra/legging.",
    subcategories: [
      { name: "Saias Curtas", slug: "saias-curtas", href: "/roupas/shorts-e-saias/saias-curtas" },
      { name: "Saias Midi", slug: "saias-midi", href: "/roupas/shorts-e-saias/saias-midi" },
      { name: "Saias Jeans", slug: "saias-jeans", href: "/roupas/shorts-e-saias/saias-jeans", allowedJeansColorsOnly: true },
      { name: "Shorts Jeans", slug: "shorts-jeans", href: "/roupas/shorts-e-saias/shorts-jeans", allowedJeansColorsOnly: true },
      { name: "Shorts Moletom", slug: "shorts-moletom", href: "/roupas/shorts-e-saias/shorts-moletom" },
      { name: "Shorts Courinho", slug: "shorts-courinho", href: "/roupas/shorts-e-saias/shorts-courinho" },
      { name: "Shorts Lycra/Legging", slug: "shorts-lycra-legging", href: "/roupas/shorts-e-saias/shorts-lycra-legging" },
    ],
  },
]

export function getCategoryBySlug(slug: string): CategoryConfig | undefined {
  return MAIN_CATEGORIES.find((cat) => cat.slug === slug)
}

export function getSubcategoryBySlugs(categorySlug: string, subcategorySlug: string) {
  const category = getCategoryBySlug(categorySlug)
  if (!category) return undefined
  const subcategory = category.subcategories.find((sub) => sub.slug === subcategorySlug)
  return { category, subcategory }
}
