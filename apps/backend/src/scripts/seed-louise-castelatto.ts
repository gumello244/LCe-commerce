import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, ProductStatus } from "@medusajs/framework/utils"
import {
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
} from "@medusajs/medusa/core-flows"

export default async function seedLouiseCastelatto({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER) as any
  const query = container.resolve(ContainerRegistrationKeys.QUERY) as any

  logger.info("Iniciando cadastro de categorias e produtos Louise Castelatto...")

  // 1. Obter Sales Channel e Shipping Profile existentes
  const { data: salesChannels } = await query.graph({
    entity: "sales_channel",
    fields: ["id", "name"],
  })
  const salesChannel = salesChannels?.[0]

  const { data: shippingProfiles } = await query.graph({
    entity: "shipping_profile",
    fields: ["id"],
  })
  const shippingProfile = shippingProfiles?.[0]

  const { data: apiKeys } = await query.graph({
    entity: "api_key",
    fields: ["id"],
  })

  if (apiKeys?.length && salesChannel?.id) {
    try {
      await linkSalesChannelsToApiKeyWorkflow(container).run({
        input: {
          id: apiKeys[0].id,
          add: [salesChannel.id],
        },
      })
      logger.info("Chave API vinculada ao Sales Channel.")
    } catch (e) {
      // Ignorar se já estiver vinculado
    }
  }

  // 2. Definir árvore de categorias e subcategorias
  const categoriesStructure = [
    {
      name: "Blusas",
      handle: "blusas",
      children: [
        { name: "Blusinhas", handle: "blusinhas" },
        { name: "Cropped", handle: "cropped" },
        { name: "Body", handle: "body" },
        { name: "Top", handle: "top" },
        { name: "Blusa Manga Longa", handle: "blusa-manga-longa" },
      ],
    },
    {
      name: "Vestidos",
      handle: "vestidos",
      children: [
        { name: "Longo", handle: "longo" },
        { name: "Curto", handle: "curto" },
        { name: "Midi", handle: "midi" },
        { name: "Justo", handle: "justo" },
        { name: "Solto", handle: "solto" },
      ],
    },
    {
      name: "Conjuntos",
      handle: "conjuntos",
      children: [
        { name: "Noite/Festa", handle: "noite-festa" },
        { name: "Casual", handle: "casual" },
      ],
    },
    {
      name: "Calças",
      handle: "calcas",
      children: [
        { name: "Flare", handle: "flare" },
        { name: "Cargo", handle: "cargo" },
        { name: "Legging", handle: "legging" },
        { name: "Skinny", handle: "skinny" },
        { name: "Wide Leg", handle: "wide-leg" },
        { name: "Cintura Alta", handle: "cintura-alta" },
        { name: "Calça Moletom", handle: "calca-moletom" },
      ],
    },
    {
      name: "Shorts e Saias",
      handle: "shorts-e-saias",
      children: [
        { name: "Saias Curtas", handle: "saias-curtas" },
        { name: "Saias Midi", handle: "saias-midi" },
        { name: "Saias Jeans", handle: "saias-jeans" },
        { name: "Shorts Jeans", handle: "shorts-jeans" },
        { name: "Shorts Moletom", handle: "shorts-moletom" },
        { name: "Shorts Courinho", handle: "shorts-courinho" },
        { name: "Shorts Lycra/Legging", handle: "shorts-lycra-legging" },
      ],
    },
  ]

  // Buscar categorias já existentes para não duplicar
  const { data: existingCategories } = await query.graph({
    entity: "product_category",
    fields: ["id", "handle", "name"],
  })

  const categoryMap = new Map<string, string>()
  existingCategories?.forEach((cat: any) => {
    categoryMap.set(cat.handle, cat.id)
  })

  // Criar categorias pai primeiro
  for (const parentStruct of categoriesStructure) {
    if (!categoryMap.has(parentStruct.handle)) {
      const { result } = await createProductCategoriesWorkflow(container).run({
        input: {
          product_categories: [
            {
              name: parentStruct.name,
              handle: parentStruct.handle,
              is_active: true,
            },
          ],
        },
      })
      categoryMap.set(parentStruct.handle, result[0].id)
    }

    const parentId = categoryMap.get(parentStruct.handle)!

    // Criar subcategorias filhas
    for (const childStruct of parentStruct.children) {
      if (!categoryMap.has(childStruct.handle)) {
        const { result } = await createProductCategoriesWorkflow(container).run({
          input: {
            product_categories: [
              {
                name: childStruct.name,
                handle: childStruct.handle,
                is_active: true,
                parent_category_id: parentId,
              },
            ],
          },
        })
        categoryMap.set(childStruct.handle, result[0].id)
      }
    }
  }

  logger.info("Categorias verificadas/criadas no banco de dados.")

  // 3. Lista de Produtos Fictícios Reais da Louise Castelatto
  const productsToSeed = [
    // ── BLUSAS ──
    {
      title: "Cropped Canelado Premium",
      handle: "cropped-canelado-premium",
      categoryHandles: ["blusas", "cropped"],
      description: "Cropped em malha canelada de alta gramatura com toque suave e modelagem ajustada.",
      price: 89.9,
      colors: ["Rosa", "Preto", "Branco", "Bege"],
      sizes: ["P", "M", "G"],
      imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop",
    },
    {
      title: "Blusa Manga Longa Tricot Touch",
      handle: "blusa-manga-longa-tricot-touch",
      categoryHandles: ["blusas", "blusa-manga-longa"],
      description: "Blusa feminina em tricot leve com manga longa e decote canoa versátil.",
      price: 129.9,
      colors: ["Bege", "Preto", "Rosa"],
      sizes: ["P", "M", "G"],
      imageUrl: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&auto=format&fit=crop",
    },
    {
      title: "Body Decote Trançado Elegance",
      handle: "body-decote-trancado-elegance",
      categoryHandles: ["blusas", "body"],
      description: "Body justo em poliamida premium com detalhe trançado no decote e fecho prático.",
      price: 119.9,
      colors: ["Preto", "Branco", "Rosa"],
      sizes: ["P", "M", "G"],
      imageUrl: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&auto=format&fit=crop",
    },
    {
      title: "Top Cortininha Acetinado",
      handle: "top-cortininha-acetinado",
      categoryHandles: ["blusas", "top"],
      description: "Top com amarração versátil em tecido de toque acetinado elegante.",
      price: 79.9,
      colors: ["Preto", "Branco", "Rosa", "Azul"],
      sizes: ["P", "M", "G"],
      imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop",
    },
    {
      title: "Blusinha Viscose Comfort",
      handle: "blusinha-viscose-comfort",
      categoryHandles: ["blusas", "blusinhas"],
      description: "Blusinha básica essencial em viscose fluida, perfeita para o dia a dia.",
      price: 69.9,
      colors: ["Branco", "Rosa", "Bege", "Preto"],
      sizes: ["P", "M", "G", "GG"],
      imageUrl: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&auto=format&fit=crop",
    },

    // ── VESTIDOS ──
    {
      title: "Vestido Seda Solto Floral",
      handle: "vestido-seda-solto-floral",
      categoryHandles: ["vestidos", "solto"],
      description: "Vestido curto soltinho em toque de seda fluida com estampa delicada e caimento leve.",
      price: 249.9,
      colors: ["Rosa", "Bege", "Azul"],
      sizes: ["P", "M", "G", "GG"],
      imageUrl: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&auto=format&fit=crop",
    },
    {
      title: "Vestido Midi Canelado Fenda Frontal",
      handle: "vestido-midi-canelado-fenda-frontal",
      categoryHandles: ["vestidos", "midi"],
      description: "Vestido midi ajustado em malha canelada estruturada com fenda lateral elegante.",
      price: 189.9,
      colors: ["Preto", "Rosa", "Bege"],
      sizes: ["P", "M", "G"],
      imageUrl: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&auto=format&fit=crop",
    },
    {
      title: "Vestido Longo Festas Acetinado",
      handle: "vestido-longo-festas-acetinado",
      categoryHandles: ["vestidos", "longo"],
      description: "Vestido longo fluido em fenda elegante e decote em V para ocasiões especiais.",
      price: 329.9,
      colors: ["Preto", "Rosa", "Azul"],
      sizes: ["P", "M", "G"],
      imageUrl: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop",
    },
    {
      title: "Vestido Curto Alfaiataria Chic",
      handle: "vestido-curto-alfaiataria-chic",
      categoryHandles: ["vestidos", "curto"],
      description: "Vestido curto em alfaiataria encorpada com botoamento frontal clássico.",
      price: 199.9,
      colors: ["Preto", "Branco", "Bege"],
      sizes: ["36", "38", "40", "42"],
      imageUrl: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&auto=format&fit=crop",
    },
    {
      title: "Vestido Justo Modelador Sculpt",
      handle: "vestido-justo-modelador-sculpt",
      categoryHandles: ["vestidos", "justo"],
      description: "Vestido curto em poliamida com dupla camada que modela a silhueta sem apertar.",
      price: 179.9,
      colors: ["Preto", "Rosa", "Verde"],
      sizes: ["P", "M", "G"],
      imageUrl: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&auto=format&fit=crop",
    },

    // ── CONJUNTOS ──
    {
      title: "Conjunto Alfaiataria Noite Glam",
      handle: "conjunto-alfaiataria-noite-glam",
      categoryHandles: ["conjuntos", "noite-festa"],
      description: "Conjunto elegante de cropped e calça pantalona em alfaiataria fina para eventos e festas.",
      price: 289.9,
      colors: ["Preto", "Rosa", "Branco"],
      sizes: ["P", "M", "G"],
      imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop",
    },
    {
      title: "Conjunto Casual Linho Light",
      handle: "conjunto-casual-linho-light",
      categoryHandles: ["conjuntos", "casual"],
      description: "Conjunto leve de blusa e shorts em toque de linho, perfeito para um look casual refinado.",
      price: 219.9,
      colors: ["Bege", "Verde", "Rosa"],
      sizes: ["P", "M", "G"],
      imageUrl: "https://images.unsplash.com/photo-1548883354-7622d03aca27?w=600&auto=format&fit=crop",
    },

    // ── CALÇAS ──
    {
      title: "Calça Wide Leg Alfaiataria High",
      handle: "calca-wide-leg-alfaiataria-high",
      categoryHandles: ["calcas", "wide-leg"],
      description: "Calça de alfaiataria pantalona com cintura alta, bolso faca e caimento impecável.",
      price: 199.9,
      colors: ["Preto", "Bege", "Rosa", "Verde"],
      sizes: ["36", "38", "40", "42"],
      imageUrl: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&auto=format&fit=crop",
    },
    {
      title: "Calça Cargo Street Utility",
      handle: "calca-cargo-street-utility",
      categoryHandles: ["calcas", "cargo"],
      description: "Calça estilo cargo utilitária em sarja leve com bolsos laterais funcionais.",
      price: 219.9,
      colors: ["Preto", "Bege", "Verde"],
      sizes: ["36", "38", "40", "42"],
      imageUrl: "https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=600&auto=format&fit=crop",
    },
    {
      title: "Calça Jeans Flare Cintura Alta",
      handle: "calca-jeans-flare-cintura-alta",
      categoryHandles: ["calcas", "flare"],
      description: "Calça jeans flare com alta elasticidade que valoriza as curvas e alonga a silhueta.",
      price: 239.9,
      colors: ["Jeans Médio", "Jeans Escuro"],
      sizes: ["36", "38", "40", "42"],
      imageUrl: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop",
    },
    {
      title: "Calça Legging Anatomic Flex",
      handle: "calca-legging-anatomic-flex",
      categoryHandles: ["calcas", "legging"],
      description: "Calça legging em cirrê/suplex encorpado de cós alto duplo sem transparência.",
      price: 139.9,
      colors: ["Preto", "Azul", "Verde"],
      sizes: ["P", "M", "G", "GG"],
      imageUrl: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&auto=format&fit=crop",
    },
    {
      title: "Calça Moletom Jogger Confort",
      handle: "calca-moletom-jogger-confort",
      categoryHandles: ["calcas", "moda-frio", "calca-moletom"],
      description: "Calça jogger de moletom flanelado com elástico no cós e na barra.",
      price: 169.9,
      colors: ["Preto", "Bege", "Rosa"],
      sizes: ["P", "M", "G", "GG"],
      imageUrl: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=600&auto=format&fit=crop",
    },
    {
      title: "Calça Jeans Skinny Modeladora",
      handle: "calca-jeans-skinny-modeladora",
      categoryHandles: ["calcas", "skinny"],
      description: "Calça jeans skinny empina bumbum com muito elastano e lavagem atemporal.",
      price: 219.9,
      colors: ["Jeans Claro", "Jeans Médio", "Jeans Escuro"],
      sizes: ["36", "38", "40", "42"],
      imageUrl: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop",
    },

    // ── SHORTS E SAIAS ──
    {
      title: "Shorts Jeans Barra Desfiada High",
      handle: "shorts-jeans-barra-desfiada-high",
      categoryHandles: ["shorts-e-saias", "shorts-jeans"],
      description: "Shorts jeans de cintura alta com lavagem moderna e detalhes de barra desfiada.",
      price: 149.9,
      colors: ["Jeans Claro", "Jeans Médio", "Jeans Escuro"],
      sizes: ["36", "38", "40", "42"],
      imageUrl: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600&auto=format&fit=crop",
    },
    {
      title: "Saia Midi Fenda Frontal Satin",
      handle: "saia-midi-fenda-frontal-satin",
      categoryHandles: ["shorts-e-saias", "saias-midi"],
      description: "Saia midi fluida em cetim acetinado com caimento em viés e fenda lateral.",
      price: 169.9,
      colors: ["Preto", "Bege", "Rosa"],
      sizes: ["P", "M", "G"],
      imageUrl: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600&auto=format&fit=crop",
    },
    {
      title: "Shorts Moletom Casual Summer",
      handle: "shorts-moletom-casual-summer",
      categoryHandles: ["shorts-e-saias", "shorts-moletom"],
      description: "Shorts leve em moletom sem felpa com cordão ajustável no cós.",
      price: 99.9,
      colors: ["Rosa", "Bege", "Preto"],
      sizes: ["P", "M", "G"],
      imageUrl: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600&auto=format&fit=crop",
    },
    {
      title: "Saia Curta Alfaiataria Drapeada",
      handle: "saia-curta-alfaiataria-drapeada",
      categoryHandles: ["shorts-e-saias", "saias-curtas"],
      description: "Mini saia em alfaiataria encorpada com sobreposição frontal estilo short saia.",
      price: 139.9,
      colors: ["Preto", "Branco", "Rosa"],
      sizes: ["36", "38", "40", "42"],
      imageUrl: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600&auto=format&fit=crop",
    },
    {
      title: "Shorts Courinho Sintético Chic",
      handle: "shorts-courinho-sintetico-chic",
      categoryHandles: ["shorts-e-saias", "shorts-courinho"],
      description: "Shorts em couro sintético de alta durabilidade com cintura alta e bolsos.",
      price: 179.9,
      colors: ["Preto", "Bege", "Marrom"],
      sizes: ["P", "M", "G"],
      imageUrl: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600&auto=format&fit=crop",
    },
    {
      title: "Saia Jeans Evasê Botoamentos",
      handle: "saia-jeans-evase-botoamentos",
      categoryHandles: ["shorts-e-saias", "saias-jeans"],
      description: "Saia jeans evasê com botões frontais e cintura alta estruturada.",
      price: 159.9,
      colors: ["Jeans Claro", "Jeans Médio", "Jeans Escuro"],
      sizes: ["36", "38", "40", "42"],
      imageUrl: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600&auto=format&fit=crop",
    },
  ]

  // Buscar produtos já existentes para evitar criar duplicados
  const { data: existingProducts } = await query.graph({
    entity: "product",
    fields: ["id", "handle"],
  })
  const existingHandles = new Set(existingProducts?.map((p: any) => p.handle) || [])

  let countCreated = 0

  for (const item of productsToSeed) {
    if (existingHandles.has(item.handle)) {
      continue
    }

    const catIds = item.categoryHandles
      .map((h) => categoryMap.get(h))
      .filter(Boolean) as string[]

    const productInput: any = {
      title: item.title,
      handle: item.handle,
      description: item.description,
      status: ProductStatus.PUBLISHED,
      category_ids: catIds,
      images: [{ url: item.imageUrl }],
      options: [
        { title: "Cor", values: item.colors },
        { title: "Tamanho", values: item.sizes },
      ],
      variants: [],
    }

    if (shippingProfile?.id) {
      productInput.shipping_profile_id = shippingProfile.id
    }
    if (salesChannel?.id) {
      productInput.sales_channels = [{ id: salesChannel.id }]
    }

    // Criar variantes combinando cada cor com cada tamanho
    for (let cIdx = 0; cIdx < item.colors.length; cIdx++) {
      const color = item.colors[cIdx]
      for (let sIdx = 0; sIdx < item.sizes.length; sIdx++) {
        const size = item.sizes[sIdx]
        const cleanColor = color.toLowerCase().replace(/[^a-z0-9]/g, "")
        const cleanSize = size.toLowerCase().replace(/[^a-z0-9]/g, "")
        const sku = `${item.handle.substring(0, 10).toUpperCase()}-C${cIdx + 1}S${sIdx + 1}-${cleanColor.toUpperCase()}-${cleanSize.toUpperCase()}`
        productInput.variants.push({
          title: `${color} / ${size}`,
          sku,
          options: {
            Cor: color,
            Tamanho: size,
          },
          prices: [
            {
              amount: item.price,
              currency_code: "brl",
            },
          ],
        })
      }
    }

    await createProductsWorkflow(container).run({
      input: {
        products: [productInput],
      },
    })

    countCreated++
    logger.info(`Produto cadastrado: ${item.title}`)
  }

  logger.info(`Concluído! ${countCreated} novos produtos cadastrados na Louise Castelatto.`)
}
