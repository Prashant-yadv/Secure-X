import type React from "react"
import type { Metadata } from "next"
import { Inter, Roboto_Mono } from "next/font/google"
import "./globals.css"

// 🧩 Google Fonts Configuration
const interSans = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
})

// 🧩 Site Metadata (optimized for SEO + favicon fix)
export const metadata: Metadata = {
  title: "SecureX - Password Security Analyzer",
  description:
    "Advanced password strength checker and security analyzer for cybersecurity professionals.",
  generator: "Next.js",
  icons: {
    icon: "/secureX.ico",      // ✅ your correct favicon path
    shortcut: "/secureX.ico",
    apple: "/secureX.ico",
  },
  openGraph: {
    title: "SecureX - Password Security Analyzer",
    description:
      "Protect your credentials with SecureX — advanced password analysis and cybersecurity insights.",
    url: "https://securx.netlify.app/",
    siteName: "SecureX",
    images: [
      {
        url: "/secureX.ico",
        width: 512,
        height: 512,
        alt: "SecureX Icon",
      },
    ],
    type: "website",
  },
}

// 🧩 Root Layout Component
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${interSans.variable} ${robotoMono.variable}`}
    >
      <head>
        {/* ✅ Favicon link for all browsers */}
        <link rel="icon" href="/secureX.ico" type="image/x-icon" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
