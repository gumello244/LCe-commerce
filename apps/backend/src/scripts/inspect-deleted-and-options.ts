import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export default async function inspectDeletedAndOptions({ container }: ExecArgs) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY) as any

  console.log("=== EXAMINANDO TODOS OS PRODUTOS (INCLUINDO DELETADOS) ===")
  const { data: allProducts } = await query.graph({
    entity: "product",
    fields: ["id", "title", "handle", "deleted_at", "options.id", "options.title", "options.values.id", "options.values.value", "variants.id", "variants.title", "variants.deleted_at"],
    withDeleted: true,
  })

  console.log(`Total de produtos no DB (ativos + soft-deleted): ${allProducts.length}`)
  for (const p of allProducts) {
    console.log(`\nProduto ID: ${p.id} | Título: "${p.title}" | Soft-deleted? ${p.deleted_at ? 'SIM (' + p.deleted_at + ')' : 'NÃO'}`)
    console.log(`  Opções:`, p.options?.map((o: any) => `${o.title} (Valores: ${o.values?.map((v: any) => v.value).join(", ")})`))
    console.log(`  Variantes (Total ${p.variants?.length}):`, p.variants?.map((v: any) => `${v.title} (deleted: ${!!v.deleted_at})`))
  }

  console.log("\n=== EXAMINANDO TODAS AS OPCÕES DE PRODUTOS NO BANCO ===")
  const { data: allOptions } = await query.graph({
    entity: "product_option",
    fields: ["id", "title", "product_id", "values.id", "values.value", "values.deleted_at"],
    withDeleted: true,
  })
  for (const opt of allOptions) {
    console.log(`Opção ID: ${opt.id} | Título: ${opt.title} | Produto ID: ${opt.product_id}`)
    console.log(`  Valores:`, opt.values?.map((v: any) => `${v.value} (ID: ${v.id}, deleted: ${!!v.deleted_at})`))
  }
}
