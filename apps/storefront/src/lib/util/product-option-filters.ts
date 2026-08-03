export const OPTION_VALUE_QUERY_KEY = "optionValueIds"

export type OptionValueIds = string[]

export const parseOptionValueIds = (
  searchParams: URLSearchParams | Record<string, string | string[] | undefined>
): OptionValueIds => {
  if (typeof (searchParams as URLSearchParams).getAll === "function") {
    const values = (searchParams as URLSearchParams).getAll(OPTION_VALUE_QUERY_KEY)
    return Array.from(new Set(values.filter(Boolean)))
  }

  const paramValue = (
    searchParams as Record<string, string | string[] | undefined>
  )[OPTION_VALUE_QUERY_KEY]

  if (Array.isArray(paramValue)) {
    return Array.from(new Set(paramValue.filter(Boolean)))
  }

  if (typeof paramValue === "string" && paramValue.length > 0) {
    return paramValue.split(",").filter(Boolean)
  }

  return []
}

export const parseStringFilterParams = (
  searchParams: URLSearchParams | Record<string, string | string[] | undefined>,
  key: string
): string[] => {
  if (typeof (searchParams as URLSearchParams).getAll === "function") {
    const values = (searchParams as URLSearchParams).getAll(key)
    return Array.from(new Set(values.filter(Boolean).map((v) => String(v).toLowerCase())))
  }

  const paramValue = (
    searchParams as Record<string, string | string[] | undefined>
  )[key]

  if (Array.isArray(paramValue)) {
    return Array.from(
      new Set(paramValue.filter(Boolean).map((v) => String(v).toLowerCase()))
    )
  }

  if (typeof paramValue === "string" && paramValue.length > 0) {
    return paramValue.split(",").filter(Boolean).map((v) => v.trim().toLowerCase())
  }

  return []
}

export const resolveOptionValueIds = (
  searchParams: URLSearchParams | Record<string, string | string[] | undefined>,
  optionValueMap: Record<string, string[]> = {}
): string[] => {
  const directIds = parseOptionValueIds(searchParams)
  const colors = parseStringFilterParams(searchParams, "color")
  const sizes = parseStringFilterParams(searchParams, "size")

  const mappedIds: string[] = []

  colors.forEach((c) => {
    const ids = optionValueMap[c]
    if (ids?.length) {
      mappedIds.push(...ids)
    }
  })

  sizes.forEach((s) => {
    const ids = optionValueMap[s]
    if (ids?.length) {
      mappedIds.push(...ids)
    }
  })

  return Array.from(new Set([...directIds, ...mappedIds]))
}
