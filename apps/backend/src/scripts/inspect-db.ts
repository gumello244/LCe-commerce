import { ExecArgs } from "@medusajs/framework/types"

export default async function inspectDb({ container }: ExecArgs) {
  const regionModule = container.resolve("region") as any
  const salesChannelModule = container.resolve("sales_channel") as any
  const apiKeyModule = container.resolve("api_key") as any

  const regions = await regionModule.listRegions({}, { relations: ["countries"] })
  const salesChannels = await salesChannelModule.listSalesChannels()
  const apiKeys = await apiKeyModule.listApiKeys({ type: "publishable" })

  console.log("=== REGIONS ===")
  console.log(JSON.stringify(regions, null, 2))

  console.log("=== SALES CHANNELS ===")
  console.log(JSON.stringify(salesChannels, null, 2))

  console.log("=== API KEYS ===")
  console.log(JSON.stringify(apiKeys, null, 2))
}
