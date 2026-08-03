import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, ProductStatus } from "@medusajs/framework/utils"
import { createProductsWorkflow } from "@medusajs/medusa/core-flows"

/**
 * Script utilitário para cadastrar produtos personalizados no Medusa V2.
 * 
 * Como usar:
 * 1. Preencha os dados no objeto `NOVO_PRODUTO` abaixo.
 * 2. Execute no terminal dentro da pasta `apps/backend`:
 *    npx medusa exec ./src/scripts/add-custom-product.ts
 */

const NOVO_PRODUTO = {
  title: "Nome do Seu Produto Aqui",
  handle: "nome-do-seu-produto-aqui", // Identificador único na URL (kebab-case)
  description: "Descrição detalhada do produto para ser exibida no storefront.",
  price: 159.90, // Preço em Reais (R$)
  
  // Handles das categorias/subcategorias onde o produto deve aparecer
  // Exemplo: ["blusas", "cropped"] ou ["vestidos", "solto"] ou ["calcas", "wide-leg"]
  categoryHandles: ["blusas", "cropped"],
  
  // Cores disponíveis para o produto (ex: ["Preto", "Rosa", "Branco"])
  colors: ["Preto", "Rosa", "Branco"],
  
  // Tamanhos disponíveis para o produto (ex: ["P", "M", "G"] ou ["36", "38", "40"])
  sizes: ["P", "M", "G"],
  
  // URL da imagem principal do produto
  // Pode ser link da web (Unsplash, Pinterest, CDN) ou caminho hospedado
  imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop",
}

export default async function addCustomProduct({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER) as any
  const query = container.resolve(ContainerRegistrationKeys.QUERY) as any

  logger.info(`Iniciando cadastro do produto: "${NOVO_PRODUTO.title}"...`)

  // 1. Obter Sales Channel e Shipping Profile
  const { data: salesChannels } = await query.graph({
    entity: "sales_channel",
    fields: ["id"],
  })
  const salesChannel = salesChannels?.[0]

  const { data: shippingProfiles } = await query.graph({
    entity: "shipping_profile",
    fields: ["id"],
  })
  const shippingProfile = shippingProfiles?.[0]

  // 2. Mapear Categorias pelos Handles
  const { data: categories } = await query.graph({
    entity: "product_category",
    fields: ["id", "handle"],
    filters: {
      handle: NOVO_PRODUTO.categoryHandles,
    },
  })
  const categoryIds = categories?.map((c: any) => c.id) || []

  if (categoryIds.length === 0) {
    logger.warn(`Atenção: Nenhuma categoria encontrada com os handles: ${NOVO_PRODUTO.categoryHandles.join(", ")}`)
  }

  // 3. Montar Estrutura do Produto
  const productInput: any = {
    title: NOVO_PRODUTO.title,
    handle: NOVO_PRODUTO.handle,
    description: NOVO_PRODUTO.description,
    status: ProductStatus.PUBLISHED,
    category_ids: categoryIds,
    images: [{ url: NOVO_PRODUTO.imageUrl }],
    options: [
      { title: "Cor", values: NOVO_PRODUTO.colors },
      { title: "Tamanho", values: NOVO_PRODUTO.sizes },
    ],
    variants: [],
  }

  if (shippingProfile?.id) {
    productInput.shipping_profile_id = shippingProfile.id
  }
  if (salesChannel?.id) {
    productInput.sales_channels = [{ id: salesChannel.id }]
  }

  // 4. Gerar Variantes de Cor e Tamanho
  for (let cIdx = 0; cIdx < NOVO_PRODUTO.colors.length; cIdx++) {
    const color = NOVO_PRODUTO.colors[cIdx]
    for (let sIdx = 0; sIdx < NOVO_PRODUTO.sizes.length; sIdx++) {
      const size = NOVO_PRODUTO.sizes[sIdx]
      const cleanColor = color.toLowerCase().replace(/[^a-z0-9]/g, "")
      const cleanSize = size.toLowerCase().replace(/[^a-z0-9]/g, "")
      const sku = `${NOVO_PRODUTO.handle.substring(0, 10).toUpperCase()}-C${cIdx + 1}S${sIdx + 1}-${cleanColor.toUpperCase()}-${cleanSize.toUpperCase()}`

      productInput.variants.push({
        title: `${color} / ${size}`,
        sku,
        options: {
          Cor: color,
          Tamanho: size,
        },
        prices: [
          {
            amount: NOVO_PRODUTO.price,
            currency_code: "brl",
          },
        ],
      })
    }
  }

  // 5. Executar criação no Medusa
  await createProductsWorkflow(container).run({
    input: {
      products: [productInput],
    },
  })

  logger.info(`✅ Produto "${NOVO_PRODUTO.title}" cadastrado com sucesso no banco de dados!`)
}
