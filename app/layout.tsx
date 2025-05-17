import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display, Space_Grotesk, Cormorant } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

import CustomCursor from "@/components/custom-cursor"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
})

const cormorant = Cormorant({
  subsets: ["latin"],
  variable: "--font-cormorant",
})

export const metadata: Metadata = {
  title: "Zinima | Interactive Digital Zine Viewer",
  description: "An immersive, scroll-driven storytelling platform for flipping through digital zines.",
  openGraph: {
    title: "Zinima | Interactive Digital Zine Viewer",
    description: "An immersive, scroll-driven storytelling platform for flipping through digital zines.",
    url: "https://zinima.vercel.app",
    siteName: "Zinima",
    images: [
      {
        url: "https://zinima.vercel.app/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Zinima - Interactive Digital Zine Viewer",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zinima | Interactive Digital Zine Viewer",
    description: "An immersive, scroll-driven storytelling platform for flipping through digital zines.",
    images: ["https://zinima.vercel.app/og-image.jpg"],
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} ${spaceGrotesk.variable} ${cormorant.variable} font-sans antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          
            <CustomCursor />
            {children}
      
        </ThemeProvider>
      </body>
    </html>
  )
}
