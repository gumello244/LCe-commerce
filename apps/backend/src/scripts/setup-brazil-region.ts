import { ExecArgs } from "@medusajs/framework/types"
import {
  createRegionsWorkflow,
  createTaxRegionsWorkflow,
  updateStoresWorkflow,
} from "@medusajs/medusa/core-flows"

export default async function setupBrazilRegion({ container }: ExecArgs) {
  const logger = container.resolve("logger") as any
  const storeModule = container.resolve("store") as any
  const regionModule = container.resolve("region") as any

  logger.info("Setting up Louise Castelatto Store & Brazil Region (BRL)...")

  // 1. Get current store
  const [store] = await storeModule.listStores()
  if (store) {
    const newCurrencies = [
      { currency_code: "brl", is_default: true },
      { currency_code: "usd", is_default: false },
      { currency_code: "eur", is_default: false },
    ]

    await updateStoresWorkflow(container).run({
      input: {
        selector: { id: store.id },
        update: {
          name: "Louise Castelatto",
          supported_currencies: newCurrencies,
        },
      },
    })
    logger.info("Updated store name to 'Louise Castelatto' and set BRL as default currency.")
  }

  // 2. Check if Brazil region exists
  const existingRegions = await regionModule.listRegions({ currency_code: "brl" })
  if (existingRegions.length === 0) {
    logger.info("Creating Brazil region...")
    const { result: regionResult } = await createRegionsWorkflow(container).run({
      input: {
        regions: [
          {
            name: "Brasil",
            currency_code: "brl",
            countries: ["br"],
            payment_providers: ["pp_system_default"],
          },
        ],
      },
    })
    logger.info(`Created region 'Brasil' (${regionResult[0]?.id}).`)

    try {
      await createTaxRegionsWorkflow(container).run({
        input: [
          {
            country_code: "br",
          },
        ],
      })
      logger.info("Created Tax Region for Brasil (BR).")
    } catch (e: any) {
      logger.warn(`Tax region note: ${e.message}`)
    }
  } else {
    logger.info("Region 'Brasil' already exists.")
  }

  logger.info("Setup Brazil Region completed successfully!")
}
