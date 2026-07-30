import { ExecArgs } from "@medusajs/framework/types"

export default async function getPublishableKey({ container }: ExecArgs) {
  const apiKeyModule = container.resolve("api_key") as any
  const keys = await apiKeyModule.listApiKeys({ type: "publishable" })
  console.log("=== PUBLISHABLE_API_KEYS ===")
  console.log(JSON.stringify(keys, null, 2))
}
