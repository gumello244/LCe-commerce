import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import localFont from "next/font/local"
import "styles/globals.css"

const jhcSineas = localFont({
  src: "../../public/fonts/JHCSineas-Extralight.otf",
  variable: "--font-jhc-sineas",
  display: "swap",
})

const robotoBoldCondensed = localFont({
  src: "../../public/fonts/Roboto-BoldCondensed.ttf",
  variable: "--font-roboto-condensed",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html
      lang="pt-BR"
      className={`${jhcSineas.variable} ${robotoBoldCondensed.variable}`}
      data-mode="light"
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}

