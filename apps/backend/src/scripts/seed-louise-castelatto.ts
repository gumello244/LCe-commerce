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

  // 3. Catálogo de 50 Produtos Reais e Diversificados da Louise Castelatto
  const productsToSeed = [
    // ── BLUSAS (12 produtos) ──
    {
      title: "Cropped Canelado Premium",
      handle: "cropped-canelado-premium",
      categoryHandles: ["blusas", "cropped"],
      description: "Cropped em malha canelada de alta gramatura com toque suave e modelagem ajustada.",
      price: 89.9,
      colors: ["Rosa", "Preto", "Branco"],
      sizes: ["P", "M", "G"],
      imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop",
    },
    {
      title: "Cropped Amarração Frontal Satin",
      handle: "cropped-amarracao-frontal-satin",
      categoryHandles: ["blusas", "cropped"],
      description: "Cropped estiloso com amarração frontal cruzada em tecido acetinado premium.",
      price: 99.9,
      colors: ["Off White", "Preto", "Fúcsia"],
      sizes: ["P", "M", "G"],
      imageUrl: "https://images.unsplash.com/photo-1554412933-514a83d2f3c8?w=600&auto=format&fit=crop",
    },
    {
      title: "Cropped Korset Estruturado",
      handle: "cropped-korset-estruturado",
      categoryHandles: ["blusas", "cropped"],
      description: "Cropped estilo corset com barbatanas flexíveis e decote coração valorizando o busto.",
      price: 119.9,
      colors: ["Preto", "Branco", "Vinho"],
      sizes: ["P", "M", "G"],
      imageUrl: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&auto=format&fit=crop",
    },
    {
      title: "Blusinha Viscose Comfort",
      handle: "blusinha-viscose-comfort",
      categoryHandles: ["blusas", "blusinhas"],
      description: "Blusinha básica essencial em viscose fluida, perfeita para o dia a dia.",
      price: 69.9,
      colors: ["Branco", "Rosa", "Bege"],
      sizes: ["P", "M", "G", "GG"],
      imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop",
    },
    {
      title: "Blusinha Gola Alta Ribana",
      handle: "blusinha-gola-alta-ribana",
      categoryHandles: ["blusas", "blusinhas"],
      description: "Blusa regata com gola alta refinada em tecido de ribana encorpado.",
      price: 79.9,
      colors: ["Preto", "Off White", "Verde Militar"],
      sizes: ["P", "M", "G"],
      imageUrl: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&auto=format&fit=crop",
    },
    {
      title: "Blusinha Decote V Suplex",
      handle: "blusinha-decote-v-suplex",
      categoryHandles: ["blusas", "blusinhas"],
      description: "Blusinha clássica com decote em V em suplex duplo de toque aveludado.",
      price: 74.9,
      colors: ["Nude", "Preto", "Rosa Bebê"],
      sizes: ["P", "M", "G"],
      imageUrl: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&auto=format&fit=crop",
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
      title: "Body Manga Única Assimétrico",
      handle: "body-manga-unica-assimetrico",
      categoryHandles: ["blusas", "body"],
      description: "Body fashionista com recorte de um ombro só e malha dupla sculpting.",
      price: 129.9,
      colors: ["Preto", "Chocolate", "Branco"],
      sizes: ["P", "M", "G"],
      imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop",
    },
    {
      title: "Top Cortininha Acetinado",
      handle: "top-cortininha-acetinado",
      categoryHandles: ["blusas", "top"],
      description: "Top com amarração versátil em tecido de toque acetinado elegante.",
      price: 79.9,
      colors: ["Preto", "Branco", "Rosa"],
      sizes: ["P", "M", "G"],
      imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop",
    },
    {
      title: "Top Faixa Tomara que Caia",
      handle: "top-faixa-tomara-que-caia",
      categoryHandles: ["blusas", "top"],
      description: "Top faixa em poliamida com elástico de sustentação superior interna.",
      price: 64.9,
      colors: ["Preto", "Off White", "Azul Bebê"],
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
      title: "Blusa Manga Bufante Modal Chic",
      handle: "blusa-manga-bufante-modal-chic",
      categoryHandles: ["blusas", "blusa-manga-longa"],
      description: "Blusa em fio modal macio com detalhe de mangas bufantes em organza leve.",
      price: 149.9,
      colors: ["Preto", "Creme", "Terracota"],
      sizes: ["P", "M", "G"],
      imageUrl: "https://images.unsplash.com/photo-1554412933-514a83d2f3c8?w=600&auto=format&fit=crop",
    },

    // ── VESTIDOS (12 produtos) ──
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
      title: "Vestido Longo Boho Chic Linho",
      handle: "vestido-longo-boho-chic-linho",
      categoryHandles: ["vestidos", "longo"],
      description: "Vestido longo em mistura de linho com detalhes em laise e alças ajustáveis.",
      price: 299.9,
      colors: ["Cru", "Verde Sálvia", "Terracota"],
      sizes: ["P", "M", "G"],
      imageUrl: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&auto=format&fit=crop",
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
      title: "Vestido Curto Tulipa Drapeado",
      handle: "vestido-curto-tulipa-drapeado",
      categoryHandles: ["vestidos", "curto"],
      description: "Vestido curto com saia drapeada estilo tulipa e decote reto estruturado.",
      price: 189.9,
      colors: ["Rosa Choque", "Preto", "Lilás"],
      sizes: ["P", "M", "G"],
      imageUrl: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&auto=format&fit=crop",
    },
    {
      title: "Vestido Curto Balonê Night",
      handle: "vestido-curto-balone-night",
      categoryHandles: ["vestidos", "curto"],
      description: "Mini vestido na tendência balonê com cintura marcada e brilho sutil.",
      price: 219.9,
      colors: ["Preto", "Prata"],
      sizes: ["P", "M", "G"],
      imageUrl: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&auto=format&fit=crop",
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
      title: "Vestido Midi Evasê Plissado",
      handle: "vestido-midi-evase-plissado",
      categoryHandles: ["vestidos", "midi"],
      description: "Vestido midi feminino com saia plissada fluida e cinto de mesmo tecido acompanhando.",
      price: 259.9,
      colors: ["Verde Esmeralda", "Azul Marinho", "Rosa"],
      sizes: ["P", "M", "G"],
      imageUrl: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&auto=format&fit=crop",
    },
    {
      title: "Vestido Midi Tricot Modal Rib",
      handle: "vestido-midi-tricot-modal-rib",
      categoryHandles: ["vestidos", "midi"],
      description: "Vestido midi regata em tricot modal com caimento impecável ao corpo.",
      price: 229.9,
      colors: ["Areia", "Preto", "Oliva"],
      sizes: ["P", "M", "G"],
      imageUrl: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop",
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
    {
      title: "Vestido Justo Tubinho Power Stretch",
      handle: "vestido-justo-tubinho-power-stretch",
      categoryHandles: ["vestidos", "justo"],
      description: "Vestido tubinho clássico com alto teor de elastano e decote quadrado valorizado.",
      price: 169.9,
      colors: ["Preto", "Vinho", "Nude"],
      sizes: ["P", "M", "G"],
      imageUrl: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&auto=format&fit=crop",
    },
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
      title: "Vestido Soltinho Camisetão Breeze",
      handle: "vestido-soltinho-camisetao-breeze",
      categoryHandles: ["vestidos", "solto"],
      description: "Vestido em algodão peruano no estilo t-shirt dress descontraído e ultra confortável.",
      price: 139.9,
      colors: ["Off White", "Cinza Mescla", "Preto"],
      sizes: ["P", "M", "G"],
      imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop",
    },

    // ── CONJUNTOS (5 produtos) ──
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
      title: "Conjunto Paetê Festas Glow",
      handle: "conjunto-paete-festas-glow",
      categoryHandles: ["conjuntos", "noite-festa"],
      description: "Conjunto brilhante de top corset e mini saia totalmente forrados em paetês.",
      price: 349.9,
      colors: ["Prata", "Preto", "Dourado"],
      sizes: ["P", "M", "G"],
      imageUrl: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&auto=format&fit=crop",
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
    {
      title: "Conjunto Moletom Aeroporto Soft",
      handle: "conjunto-moletom-aeroporto-soft",
      categoryHandles: ["conjuntos", "casual"],
      description: "Conjunto comfy de blusão oversize e calça jogger em moletom aveludado touch.",
      price: 269.9,
      colors: ["Cinza", "Nude", "Verde Menta"],
      sizes: ["P", "M", "G"],
      imageUrl: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=600&auto=format&fit=crop",
    },
    {
      title: "Conjunto Tricot Cropped e Saia Midi",
      handle: "conjunto-tricot-cropped-e-saia-midi",
      categoryHandles: ["conjuntos", "casual"],
      description: "Conjunto em tricot trabalhado composto por top regata e saia midi fendada.",
      price: 279.9,
      colors: ["Areia", "Rosa Chá", "Preto"],
      sizes: ["P", "M", "G"],
      imageUrl: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&auto=format&fit=crop",
    },

    // ── CALÇAS (14 produtos) ──
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
      title: "Calça Wide Leg Jeans Lavagem Clara",
      handle: "calca-wide-leg-jeans-lavagem-clara",
      categoryHandles: ["calcas", "wide-leg"],
      description: "Wide leg em jeans 100% algodão com cintura bem alta e barra desfeita.",
      price: 229.9,
      colors: ["Jeans Claro", "Jeans Médio"],
      sizes: ["36", "38", "40", "42"],
      imageUrl: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop",
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
      title: "Calça Cargo Parachute Nylon",
      handle: "calca-cargo-parachute-nylon",
      categoryHandles: ["calcas", "cargo"],
      description: "Calça estilo paraquedas em nylon impermeável leve com ajustadores na barra.",
      price: 239.9,
      colors: ["Caqui", "Preto", "Cinza"],
      sizes: ["P", "M", "G"],
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
      title: "Calça Flare Alfaiataria fenda",
      handle: "calca-flare-alfaiataria-fenda",
      categoryHandles: ["calcas", "flare"],
      description: "Calça bailarina flare em tecido encorpado com pequenas fendas nas barras.",
      price: 189.9,
      colors: ["Preto", "Off White", "Azul Marinho"],
      sizes: ["P", "M", "G"],
      imageUrl: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&auto=format&fit=crop",
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
      title: "Calça Legging Cirrê Brilho Satin",
      handle: "calca-legging-cirre-brilho-satin",
      categoryHandles: ["calcas", "legging"],
      description: "Legging com efeito de couro/cirrê brilhante para composições noturnas.",
      price: 149.9,
      colors: ["Preto Gloss", "Vinho Gloss"],
      sizes: ["P", "M", "G"],
      imageUrl: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&auto=format&fit=crop",
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
    {
      title: "Calça Skinny Couro Eco Premium",
      handle: "calca-skinny-couro-eco-premium",
      categoryHandles: ["calcas", "skinny"],
      description: "Calça ajustada em material sintético com toque macio e interior flanelado.",
      price: 259.9,
      colors: ["Preto", "Caramelo"],
      sizes: ["36", "38", "40", "42"],
      imageUrl: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&auto=format&fit=crop",
    },
    {
      title: "Calça Alfaiataria Cintura Alta Belt",
      handle: "calca-alfaiataria-cintura-alta-belt",
      categoryHandles: ["calcas", "cintura-alta"],
      description: "Calça reta de alfaiataria acompanhada de cinto fivela encapada no mesmo tom.",
      price: 209.9,
      colors: ["Bege", "Preto", "Rosa Millennial"],
      sizes: ["36", "38", "40", "42"],
      imageUrl: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&auto=format&fit=crop",
    },
    {
      title: "Calça Jeans Mom Fit Vintage High",
      handle: "calca-jeans-mom-fit-vintage-high",
      categoryHandles: ["calcas", "cintura-alta"],
      description: "Jeans modelo mom com cintura bem alta, corte anatômico e pegada vintage.",
      price: 229.9,
      colors: ["Jeans Médio", "Jeans 100% Algodão"],
      sizes: ["36", "38", "40", "42"],
      imageUrl: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop",
    },
    {
      title: "Calça Moletom Jogger Confort",
      handle: "calca-moletom-jogger-confort",
      categoryHandles: ["calcas", "calca-moletom"],
      description: "Calça jogger de moletom flanelado com elástico no cós e na barra.",
      price: 169.9,
      colors: ["Preto", "Bege", "Rosa"],
      sizes: ["P", "M", "G", "GG"],
      imageUrl: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=600&auto=format&fit=crop",
    },
    {
      title: "Calça Moletom Wide Leg Urban",
      handle: "calca-moletom-wide-leg-urban",
      categoryHandles: ["calcas", "calca-moletom"],
      description: "Calça ampla em moletinho leve sem punho na barra, estilo descolado urban.",
      price: 179.9,
      colors: ["Cinza Off", "Preto", "Off White"],
      sizes: ["P", "M", "G"],
      imageUrl: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=600&auto=format&fit=crop",
    },

    // ── SHORTS E SAIAS (12 produtos) ──
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
      title: "Saia Curta Prateada Disco",
      handle: "saia-curta-prateada-disco",
      categoryHandles: ["shorts-e-saias", "saias-curtas"],
      description: "Saia justa metalizada prateada com fechamento por zíper invisível traseiro.",
      price: 149.9,
      colors: ["Prata", "Dourado"],
      sizes: ["36", "38", "40"],
      imageUrl: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600&auto=format&fit=crop",
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
      title: "Saia Midi Tricot Modal Canelada",
      handle: "saia-midi-tricot-modal-canelada",
      categoryHandles: ["shorts-e-saias", "saias-midi"],
      description: "Saia midi justa em tricot canelado de cós anatômico confortável.",
      price: 179.9,
      colors: ["Nude", "Preto", "Oliva"],
      sizes: ["P", "M", "G"],
      imageUrl: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600&auto=format&fit=crop",
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
    {
      title: "Saia Jeans Cargo fenda Frontal",
      handle: "saia-jeans-cargo-fenda-frontal",
      categoryHandles: ["shorts-e-saias", "saias-jeans"],
      description: "Saia midi jeans com bolsos utilitários e fenda central imponente.",
      price: 189.9,
      colors: ["Jeans Médio"],
      sizes: ["36", "38", "40", "42"],
      imageUrl: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600&auto=format&fit=crop",
    },
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
      title: "Shorts Jeans Mom Detalhe Rasgado",
      handle: "shorts-jeans-mom-detalhe-rasgado",
      categoryHandles: ["shorts-e-saias", "shorts-jeans"],
      description: "Shorts jeans soltinho na coxa modelo mom com rasgados destroyed estilosos.",
      price: 159.9,
      colors: ["Jeans Claro", "Jeans Vintage"],
      sizes: ["36", "38", "40", "42"],
      imageUrl: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600&auto=format&fit=crop",
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
      title: "Shorts Moletinho Recorte Lateral",
      handle: "shorts-moletinho-recorte-lateral",
      categoryHandles: ["shorts-e-saias", "shorts-moletom"],
      description: "Shorts com viés lateral esportivo e bolso embutido traseiro.",
      price: 109.9,
      colors: ["Cinza", "Off White", "Verde"],
      sizes: ["P", "M", "G"],
      imageUrl: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600&auto=format&fit=crop",
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
      title: "Shorts Lycra Biker Seamless",
      handle: "shorts-lycra-biker-seamless",
      categoryHandles: ["shorts-e-saias", "shorts-lycra-legging"],
      description: "Shorts biker sem costura lateral em tecido de compressão perfeita.",
      price: 119.9,
      colors: ["Preto", "Chocolate", "Azul Marinho"],
      sizes: ["P", "M", "G"],
      imageUrl: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&auto=format&fit=crop",
    },

    // ── PRODUTOS ADICIONAIS DE DESTAQUE DA LOJA (7 produtos) ──
    {
      title: "Blusa Tricot Manga Curta Soft",
      handle: "blusa-tricot-manga-curta-soft",
      categoryHandles: ["blusas", "blusinhas"],
      description: "Blusa leve em tricot trabalhado com ponto aberto, charmosa para meia-estação.",
      price: 119.9,
      colors: ["Rosa Queimado", "Creme", "Mint"],
      sizes: ["P", "M", "G"],
      imageUrl: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&auto=format&fit=crop",
    },
    {
      title: "Vestido Curto Chiffon Romântico",
      handle: "vestido-curto-chiffon-romantico",
      categoryHandles: ["vestidos", "curto"],
      description: "Vestido delicado em chiffon leve com estampa poá e mangas fluida transparência.",
      price: 229.9,
      colors: ["Branco", "Rosa Chá"],
      sizes: ["P", "M", "G"],
      imageUrl: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&auto=format&fit=crop",
    },
    {
      title: "Conjunto Blazer e Shorts Alfaiataria",
      handle: "conjunto-blazer-e-shorts-alfaiataria",
      categoryHandles: ["conjuntos", "casual"],
      description: "Conjunto moderno de mini blazer acinturado e shorts de alfaiataria combinando.",
      price: 319.9,
      colors: ["Verde Pistache", "Off White", "Preto"],
      sizes: ["36", "38", "40", "42"],
      imageUrl: "https://images.unsplash.com/photo-1548883354-7622d03aca27?w=600&auto=format&fit=crop",
    },
    {
      title: "Calça Wide Leg Sarja Color",
      handle: "calca-wide-leg-sarja-color",
      categoryHandles: ["calcas", "wide-leg"],
      description: "Wide leg em sarja premium colorida com cintura alta e toque aveludado.",
      price: 219.9,
      colors: ["Terracota", "Verde Menta", "Rosa Bebê"],
      sizes: ["36", "38", "40", "42"],
      imageUrl: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&auto=format&fit=crop",
    },
    {
      title: "Saia Midi Plissada Metalizada Night",
      handle: "saia-midi-plissada-metalizada-night",
      categoryHandles: ["shorts-e-saias", "saias-midi"],
      description: "Saia midi com plissado firme e brilho metalizado para ocasiões noturnas.",
      price: 199.9,
      colors: ["Dourado", "Prata", "Bronze"],
      sizes: ["P", "M", "G"],
      imageUrl: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600&auto=format&fit=crop",
    },
    {
      title: "Cropped Korset Linho Natural",
      handle: "cropped-korset-linho-natural",
      categoryHandles: ["blusas", "cropped"],
      description: "Corset em linho rústico misto com amarração nas costas e barbatanas de sustentação.",
      price: 129.9,
      colors: ["Cru", "Areia", "Verde Oliva"],
      sizes: ["P", "M", "G"],
      imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop",
    },
    {
      title: "Blusa Ampla Gola Cangaço Linho",
      handle: "blusa-ampla-gola-cangaco-linho",
      categoryHandles: ["blusas", "blusinhas"],
      description: "Blusa soltinha em linho misto com gola dobrada e detalhe minimalista no punho.",
      price: 109.9,
      colors: ["Bege Claro", "Branco Off", "Terracota"],
      sizes: ["P", "M", "G"],
      imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop",
    },
  ]

  logger.info(`Total de produtos no catálogo preparado: ${productsToSeed.length}`)

  // 4. Buscar produtos já existentes no banco para manter idempotência
  const { data: existingProducts } = await query.graph({
    entity: "product",
    fields: ["id", "handle"],
  })
  const existingHandles = new Set(existingProducts?.map((p: any) => p.handle) || [])

  // Filtrar apenas produtos que ainda não foram criados
  const itemsToCreate = productsToSeed.filter((item) => !existingHandles.has(item.handle))

  if (itemsToCreate.length === 0) {
    logger.info("Todos os produtos da lista já estão cadastrados no banco de dados!")
    return
  }

  logger.info(`Cadastrando ${itemsToCreate.length} novos produtos em lotes...`)

  // Prepara os objetos de input no formato esperado pelo Medusa
  const preparedProducts = itemsToCreate.map((item, itemIdx) => {
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

    // Criar variantes combinando cor e tamanho com SKUs limpos e garantidamente únicos (P01, P02, etc.)
    const itemNum = String(itemIdx + 1).padStart(2, "0")
    for (let cIdx = 0; cIdx < item.colors.length; cIdx++) {
      const color = item.colors[cIdx]
      for (let sIdx = 0; sIdx < item.sizes.length; sIdx++) {
        const size = item.sizes[sIdx]
        const cleanColor = color.toLowerCase().replace(/[^a-z0-9]/g, "")
        const cleanSize = size.toLowerCase().replace(/[^a-z0-9]/g, "")
        const sku = `LC-P${itemNum}-C${cIdx + 1}S${sIdx + 1}-${cleanColor.toUpperCase()}-${cleanSize.toUpperCase()}`

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

    return productInput
  })

  // 5. Cadastrar em lotes (batches de 10) para velocidade máxima e menor uso de RAM
  const BATCH_SIZE = 10
  let totalCreated = 0

  for (let i = 0; i < preparedProducts.length; i += BATCH_SIZE) {
    const batch = preparedProducts.slice(i, i + BATCH_SIZE)
    await createProductsWorkflow(container).run({
      input: {
        products: batch,
      },
    })
    totalCreated += batch.length
    logger.info(`Lote ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(preparedProducts.length / BATCH_SIZE)} concluído (${totalCreated}/${preparedProducts.length} produtos cadastrados).`)
  }

  logger.info(`✨ Concluído com sucesso! ${totalCreated} produtos cadastrados para a Louise Castelatto.`)
}
