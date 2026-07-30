import { ExecArgs } from "@medusajs/framework/types"
import { linkSalesChannelsToApiKeyWorkflow } from "@medusajs/medusa/core-flows"

export default async function linkApiKeys({ container }: ExecArgs) {
  const apiKeyModule = container.resolve("api_key") as any
  const salesChannelModule = container.resolve("sales_channel") as any

  const keys = await apiKeyModule.listApiKeys({ type: "publishable" })
  const salesChannels = await salesChannelModule.listSalesChannels()

  for (const key of keys) {
    for (const sc of salesChannels) {
      try {
        await linkSalesChannelsToApiKeyWorkflow(container).run({
          input: {
            id: key.id,
            add: [sc.id],
          },
        })
        console.log(`Linked Sales Channel ${sc.id} to API key ${key.id}`)
      } catch (e: any) {
        console.log(`Already linked or error: ${e.message}`)
      }
    }
  }
}
