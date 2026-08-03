import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { deleteProductsWorkflow } from "@medusajs/medusa/core-flows"

export default async function deleteDefaultProducts({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER) as any
  const query = container.resolve(ContainerRegistrationKeys.QUERY) as any

  logger.info("Buscando produtos padrão do Medusa para deletar...")

  // Handles dos produtos padrão do starter
  const defaultHandles = ["t-shirt", "sweatshirt", "sweatpants", "shorts"]

  const { data: products } = await query.graph({
    entity: "product",
    fields: ["id", "handle", "title"],
    filters: {
      handle: defaultHandles,
    },
  })

  if (!products || products.length === 0) {
    logger.info("Nenhum produto padrão encontrado para deletar.")
    return
  }

  logger.info(`Deletando ${products.length} produtos padrão: ${products.map((p: any) => p.title).join(", ")}`)

  await deleteProductsWorkflow(container).run({
    input: {
      ids: products.map((p: any) => p.id),
    },
  })

  logger.info("Produtos padrão do Medusa deletados com sucesso!")
}
