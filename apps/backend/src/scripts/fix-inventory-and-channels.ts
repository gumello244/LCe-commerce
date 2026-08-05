import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

export default async function fixInventoryAndChannels({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER) as any
  const query = container.resolve(ContainerRegistrationKeys.QUERY) as any
  const remoteLink = container.resolve(ContainerRegistrationKeys.REMOTE_LINK) as any

  const stockLocationModule = container.resolve(Modules.STOCK_LOCATION) as any
  const inventoryModule = container.resolve(Modules.INVENTORY) as any
  const salesChannelModule = container.resolve(Modules.SALES_CHANNEL) as any
  const apiKeyModule = container.resolve(Modules.API_KEY) as any
  const productModule = container.resolve(Modules.PRODUCT) as any

  logger.info("🔧 Iniciando correção de Estoque, Locais e Sales Channels...")

  // 1. Obter ou Criar Stock Location
  let stockLocations = await stockLocationModule.listStockLocations()
  let stockLocation = stockLocations?.[0]

  if (!stockLocation) {
    logger.info("Criando local de estoque 'Estoque Principal'...")
    const [created] = await stockLocationModule.createStockLocations([
      { name: "Estoque Principal" },
    ])
    stockLocation = created
  }
  logger.info(`Stock Location ativo: ${stockLocation.name} (${stockLocation.id})`)

  // 2. Obter todos os Sales Channels, API Keys e Produtos
  const salesChannels = await salesChannelModule.listSalesChannels()
  const apiKeys = await apiKeyModule.listApiKeys({ type: "publishable" })
  const products = await productModule.listProducts({}, { relations: ["variants"] })

  logger.info(`Encontrados ${salesChannels.length} Sales Channels, ${apiKeys.length} API Keys e ${products.length} Produtos.`)

  // 3. Vincular Stock Location a TODOS os Sales Channels
  for (const sc of salesChannels) {
    try {
      await remoteLink.create([
        {
          [Modules.STOCK_LOCATION]: { stock_location_id: stockLocation.id },
          [Modules.SALES_CHANNEL]: { sales_channel_id: sc.id },
        },
      ])
      logger.info(`Stock Location vinculado ao Sales Channel ${sc.name} (${sc.id})`)
    } catch (e: any) {
      // Ignorar se já vinculado
    }
  }

  // 4. Vincular TODAS as API Keys a TODOS os Sales Channels
  for (const key of apiKeys) {
    for (const sc of salesChannels) {
      try {
        await remoteLink.create([
          {
            [Modules.API_KEY]: { api_key_id: key.id },
            [Modules.SALES_CHANNEL]: { sales_channel_id: sc.id },
          },
        ])
        logger.info(`API Key ${key.id} vinculada ao Sales Channel ${sc.name}`)
      } catch (e: any) {
        // Ignorar se já vinculado
      }
    }
  }

  // 5. Vincular TODOS os Produtos a TODOS os Sales Channels
  for (const product of products) {
    for (const sc of salesChannels) {
      try {
        await remoteLink.create([
          {
            [Modules.PRODUCT]: { product_id: product.id },
            [Modules.SALES_CHANNEL]: { sales_channel_id: sc.id },
          },
        ])
      } catch (e: any) {
        // Ignorar se já vinculado
      }
    }
  }
  logger.info("Produtos vinculados a todos os Sales Channels.")

  // 6. Criar estoque (100 unidades) para CADA Variante de Produto que não tiver estoque
  let inventoryCreatedCount = 0

  for (const product of products) {
    for (const variant of product.variants || []) {
      // Verificar se a variante já possui item de inventário vinculado
      const { data: existingLinks } = await query.graph({
        entity: "product_variant_inventory_item",
        fields: ["variant_id", "inventory_item_id"],
        filters: { variant_id: variant.id },
      })

      let inventoryItemId: string

      if (existingLinks && existingLinks.length > 0) {
        inventoryItemId = existingLinks[0].inventory_item_id
      } else {
        // Criar item de inventário
        const [invItem] = await inventoryModule.createInventoryItems([
          {
            sku: variant.sku || `SKU-${variant.id}`,
            title: variant.title,
          },
        ])
        inventoryItemId = invItem.id

        // Vincular Variante ao Item de Inventário
        await remoteLink.create([
          {
            [Modules.PRODUCT]: { variant_id: variant.id },
            [Modules.INVENTORY]: { inventory_item_id: inventoryItemId },
          },
        ])
        inventoryCreatedCount++
      }

      // Garantir nível de inventário no local de estoque
      const existingLevels = await inventoryModule.listInventoryLevels({
        inventory_item_id: inventoryItemId,
        location_id: stockLocation.id,
      })

      if (existingLevels.length === 0) {
        await inventoryModule.createInventoryLevels([
          {
            inventory_item_id: inventoryItemId,
            location_id: stockLocation.id,
            stocked_quantity: 100,
          },
        ])
      } else {
        // Atualizar estoque para 100 se estiver zerado
        if (existingLevels[0].stocked_quantity === 0) {
          await inventoryModule.updateInventoryLevels([
            {
              id: existingLevels[0].id,
              stocked_quantity: 100,
            },
          ])
        }
      }
    }
  }

  logger.info(`✅ Concluído! Estoque (100 unid. por variante) e vínculos atualizados com sucesso (${inventoryCreatedCount} novos itens de estoque criados).`)
}
