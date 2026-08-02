"use client"

import Link from "next/link"
import React from "react"

/**
 * Link simples e limpo sem prefixo de país na URL.
 */
const LocalizedClientLink = ({
  children,
  href,
  ...props
}: {
  children?: React.ReactNode
  href: string
  className?: string
  onClick?: () => void
  passHref?: true
  [x: string]: unknown
}) => {
  // Garante que hrefs vazios ou iniciados corretamente naveguem limpo
  const cleanHref = href === "" ? "/" : href

  return (
    <Link href={cleanHref} {...props}>
      {children}
    </Link>
  )
}

export default LocalizedClientLink
