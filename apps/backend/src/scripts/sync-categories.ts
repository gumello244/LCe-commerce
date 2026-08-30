import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import {
  createProductCategoriesWorkflow,
  updateProductCategoriesWorkflow,
} from "@medusajs/medusa/core-flows"

const CATEGORIES_STRUCTURE = [
  {
    name: "Blusas",
    handle: "blusas",
    description: "Blusas, croppeds, bodys, tops e blusas manga longa.",
    children: [
      { name: "Blusinhas", handle: "blusinhas", description: "Blusinhas casuais e elegantes." },
      { name: "Cropped", handle: "cropped", description: "Croppeds modernos e versáteis." },
      { name: "Body", handle: "body", description: "Bodys sofisticados e confortáveis." },
      { name: "Top", handle: "top", description: "Tops fashion e estilosos." },
      { name: "Blusa Manga Longa", handle: "blusa-manga-longa", description: "Blusas manga longa para todas as estações." },
    ],
  },
  {
    name: "Vestidos",
    handle: "vestidos",
    description: "Vestidos elegantes para todas as ocasiões.",
    children: [
      { name: "Longo", handle: "longo", description: "Vestidos longos marcantes e fluidos." },
      { name: "Curto", handle: "curto", description: "Vestidos curtos modernos e versáteis." },
      { name: "Midi", handle: "midi", description: "Vestidos midi sofisticados e elegantes." },
      { name: "Justo", handle: "justo", description: "Vestidos justos que valorizam a silhueta." },
      { name: "Solto", handle: "solto", description: "Vestidos soltos e confortáveis." },
    ],
  },
  {
    name: "Conjuntos",
    handle: "conjuntos",
    description: "Conjuntos femininos sofisticados.",
    children: [
      { name: "Noite/Festa", handle: "noite-festa", description: "Conjuntos para festas, baladas e eventos noturnos." },
      { name: "Casual", handle: "casual", description: "Conjuntos casuais para o dia a dia elegante." },
    ],
  },
  {
    name: "Calças",
    handle: "calcas",
    description: "Modelagens impecáveis de calças femininas.",
    children: [
      { name: "Flare", handle: "flare", description: "Calças modelagem flare elegante." },
      { name: "Cargo", handle: "cargo", description: "Calças cargo utilitárias e estilosas." },
      { name: "Legging", handle: "legging", description: "Leggings confortáveis e funcionais." },
      { name: "Skinny", handle: "skinny", description: "Calças skinny justas e clássicas." },
      { name: "Wide Leg", handle: "wide-leg", description: "Calças wide leg pantalona contemporâneas." },
      { name: "Cintura Alta", handle: "cintura-alta", description: "Calças com cintura alta modeladora." },
      { name: "Calça Moletom", handle: "calca-moletom", description: "Calças moletom comfy chic." },
    ],
  },
  {
    name: "Shorts e Saias",
    handle: "shorts-e-saias",
    description: "Shorts e saias para compor looks incríveis.",
    children: [
      { name: "Saias Curtas", handle: "saias-curtas", description: "Saias curtas estilosas e descontraídas." },
      { name: "Saias Midi", handle: "saias-midi", description: "Saias midi femininas e elegantes." },
      { name: "Saias Jeans", handle: "saias-jeans", description: "Saias jeans modernas e atemporais." },
      { name: "Shorts Jeans", handle: "shorts-jeans", description: "Shorts jeans essenciais para o guarda-roupa." },
      { name: "Shorts Moletom", handle: "shorts-moletom", description: "Shorts moletom confortáveis para o dia a dia." },
      { name: "Shorts Courinho", handle: "shorts-courinho", description: "Shorts em couro ecológico sofisticado." },
      { name: "Shorts Lycra/Legging", handle: "shorts-lycra-legging", description: "Shorts em lycra esportivos e casuais." },
    ],
  },
]

export default async function syncCategories({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER) as any
  const query = container.resolve(ContainerRegistrationKeys.QUERY) as any

  logger.info("Iniciando sincronização de categorias com o catálogo da Louise Castelatto...")

  const { data: existingCategories } = await query.graph({
    entity: "product_category",
    fields: ["id", "handle", "name", "parent_category_id"],
  })

  const categoryMap = new Map<string, { id: string; parent_category_id: string | null }>()
  existingCategories?.forEach((cat: any) => {
    categoryMap.set(cat.handle, { id: cat.id, parent_category_id: cat.parent_category_id })
  })

  for (const parent of CATEGORIES_STRUCTURE) {
    let parentId: string

    if (!categoryMap.has(parent.handle)) {
      const { result } = await createProductCategoriesWorkflow(container).run({
        input: {
          product_categories: [
            {
              name: parent.name,
              handle: parent.handle,
              description: parent.description,
              is_active: true,
            },
          ],
        },
      })
      parentId = result[0].id
      categoryMap.set(parent.handle, { id: parentId, parent_category_id: null })
      logger.info(`Categoria pai criada: "${parent.name}" (${parent.handle})`)
    } else {
      parentId = categoryMap.get(parent.handle)!.id
      logger.info(`Categoria pai já existe: "${parent.name}" (${parent.handle})`)
    }

    for (const child of parent.children) {
      if (!categoryMap.has(child.handle)) {
        const { result } = await createProductCategoriesWorkflow(container).run({
          input: {
            product_categories: [
              {
                name: child.name,
                handle: child.handle,
                description: child.description,
                is_active: true,
                parent_category_id: parentId,
              },
            ],
          },
        })
        categoryMap.set(child.handle, { id: result[0].id, parent_category_id: parentId })
        logger.info(`  Subcategoria criada: "${child.name}" (${child.handle})`)
      } else {
        const existingChild = categoryMap.get(child.handle)!
        if (existingChild.parent_category_id !== parentId) {
          await updateProductCategoriesWorkflow(container).run({
            input: {
              selector: { id: existingChild.id },
              update: { parent_category_id: parentId },
            },
          })
          logger.info(`  Subcategoria atualizada com parent: "${child.name}" (${child.handle})`)
        } else {
          logger.info(`  Subcategoria já configurada: "${child.name}" (${child.handle})`)
        }
      }
    }
  }

  logger.info("Sincronização de categorias finalizada com sucesso!")
}
